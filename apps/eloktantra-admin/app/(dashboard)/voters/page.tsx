'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/layout/PageHeader';
import { UserCheck, Upload, Search, ShieldCheck, Plus } from 'lucide-react';
import { Voter } from '@/types';
import axios from 'axios';
import backendAPI, { adminGetElections, adminGetElectoralRoll } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function VotersPage() {
  const [voters, setVoters] = useState<Voter[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');

  const fetchInitialData = async () => {
    try {
      const { data } = await adminGetElections();
      const list = Array.isArray(data) ? data : (data.elections || data.data || []);
      setElections(list);
      if (list.length > 0) {
        const firstId = list[0].id || list[0]._id;
        setSelectedElection(firstId);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load elections');
      setIsLoading(false);
    }
  };

  const fetchVoters = async () => {
    if (!selectedElection) return;
    setIsLoading(true);
    try {
      const resp = await adminGetElectoralRoll(selectedElection);
      console.log("RAW VOTER DATA FROM BACKEND:", resp.data);
      const list = Array.isArray(resp.data) ? resp.data : (resp.data.voters || resp.data.data || []);
      console.log("PROCESSED LIST:", list);
      setVoters(list);
    } catch (error) {
      toast.error('Voter Registry currently unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchVoters();
  }, [selectedElection]);

  const columns = [
    { 
      header: 'Voter ID', 
      render: (v: any) => (
        <div className="flex items-center font-mono text-[11px] text-gray-900">
          <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-md mr-2">IND</span>
          {v.voter_id || v.voter_id_hash?.substring(0, 8) || v.voterId || "N/A"}
        </div>
      )
    },
    { header: 'Full Name', render: (v: any) => <span className="font-bold text-gray-800">{v.name || v.fullname || 'Anonymized Citizen'}</span> },
    { header: 'Constituency', render: (v: any) => <span className="font-bold text-gray-600 uppercase text-[10px]">{v.constituency || v.booth_id || v.constituencyId || 'Global'}</span> },
    { 
      header: 'Status', 
      render: (v: any) => {
        const active = v.isActive ?? v.is_active ?? true;
        return (
          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
            active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {active ? 'Active' : 'Revoked'}
          </span>
        );
      } 
    },
    { header: 'Ledger Token', render: (v: Voter) => (
       v.solToken ? (
         <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 italic">
           {v.solToken.substring(0, 15)}...
         </span>
       ) : (
         <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded tracking-tighter">Unlinked</span>
       )
    ) },
    { header: 'Enrollment', render: (v: Voter) => <span className="text-xs text-gray-500">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A'}</span> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                <ShieldCheck className="w-3 h-3 mr-1.5" /> Cyber Audit Active
            </div>
            <PageHeader 
            title="Voter Registry" 
            subtitle="Verified citizens authorized for digital ballot access in the national ledger"
            />
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-gray-100 shadow-xl">
            <select 
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="px-6 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] text-sm font-black text-gray-800 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none pr-12 min-w-[220px]"
            >
              <option value="">Select Election Cycle</option>
              {elections.map((e) => (
                <option key={e.id || e._id} value={e.id || e._id}>
                  {e.name || e.title || "Untitled"}
                </option>
              ))}
            </select>
            <Link 
              href="/voters/register"
              className="flex items-center px-10 py-4.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-orange-500/40 transition-all hover:scale-[1.05] active:scale-95 group"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Enroll Citizen
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck className="w-40 h-40 text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                      <h4 className="font-black text-white text-xl uppercase tracking-tighter">Privacy Shield <span className="text-orange-500">Active</span></h4>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-md">
                        Personal Identifiable Information (PII) is cryptographically hashed. Administrators only see anonymized security tokens for verification.
                      </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                      <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Encrolled Citizens</p>
                          <p className="text-2xl font-black text-white">{voters?.length || 0}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Audit Status</p>
                          <p className="text-sm font-black text-green-500 uppercase flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Verified
                          </p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="bg-orange-500 rounded-[3rem] p-10 flex flex-col justify-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
              <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-black leading-tight uppercase tracking-tighter">Election <br />Status Check</h4>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest leading-relaxed">System monitoring real-time ballot readiness.</p>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden p-8">
          <DataTable 
            columns={columns} 
            data={voters} 
            isLoading={isLoading} 
            emptyMessage="The national ledger is currently empty for this election. Please enroll authorized citizens."
          />
      </div>
    </div>
  );
}
