'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/layout/PageHeader';
import { UserCheck, Upload, Search, ShieldCheck } from 'lucide-react';
import { Voter } from '@/types';
import axios from 'axios';
import backendAPI from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function VotersPage() {
  const [voters, setVoters] = useState<Voter[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVoters = async () => {
    try {
      // Calling documented /voter base path
      const { data } = await backendAPI.get('/voter/list');
      setVoters(data.users || data.voters || []);
    } catch (error) {
      toast.error('Voter Registry (NestJS) currently unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const columns = [
    { 
      header: 'Voter ID Hash', 
      render: (v: Voter) => (
        <div className="flex items-center font-mono text-[11px] text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 text-gray-400">SHA-256</span>
          {v.voter_id_hash.substring(0, 16)}...
        </div>
      )
    },
    { header: 'Booth Code', render: (v: Voter) => <span className="font-black text-gray-900">{v.booth_id}</span> },
    { 
      header: 'Eligibility', 
      render: (v: Voter) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
          v.has_voted ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
        }`}>
          {v.has_voted ? 'Voted' : 'Eligible'}
        </span>
      ) 
    },
    { header: 'Election ID', render: (v: Voter) => <span className="text-xs font-medium text-gray-400">{v.election_id}</span> },
    { header: 'Verified At', render: (v: Voter) => <span className="text-xs text-gray-500">{v.registered_at || 'N/A'}</span> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <PageHeader 
          title="Voter Registry" 
          subtitle="Verified citizens authorized for digital ballot access"
        />
        <Link 
          href="/voters/register"
          className="flex items-center px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02]"
        >
          <Upload className="w-5 h-5 mr-2" />
          Bulk Enroll
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-black text-blue-900 text-sm uppercase tracking-tight">Privacy Shield Active</h4>
            <p className="text-xs text-blue-700/80 leading-relaxed font-medium mt-0.5">
              Personal Identifiable Information (PII) is encrypted. Administrators only see cryptographic hashes.
            </p>
          </div>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-widest ring-4 ring-blue-50">
          Total: {voters?.length || 0} Citizens
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={voters} 
        isLoading={isLoading} 
        emptyMessage="Voter registry is currently empty."
      />
    </div>
  );
}
