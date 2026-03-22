'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/layout/PageHeader';
import { Plus, Power, ShieldCheck, BarChart3, Clock } from 'lucide-react';
import { Election } from '@/types';
import backendAPI from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

import axios from 'axios';

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchElections = async () => {
    try {
      // Calling documented /election base path
      const { data } = await backendAPI.get('/election');
      setElections(data.elections || data || []);
    } catch (error) {
      toast.error('Election Ledger (NestJS) currently unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await backendAPI.patch(`/voting/elections/${id}`, { status: 'ACTIVE' });
      toast.success('Election activated successfully');
      fetchElections();
    } catch (error) {
      toast.error('Activation failed. Check blockchain connection.');
    }
  };

  const columns = [
    { header: 'Election Title', render: (e: Election) => <span className="font-bold text-gray-900">{e.title}</span> },
    { 
      header: 'Status', 
      render: (e: Election) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
          e.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 
          e.status === 'ENDED' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {e.status}
        </span>
      ) 
    },
    { header: 'Start Date', render: (e: Election) => <div className="flex items-center text-xs font-medium text-gray-500"><Clock className="w-3 h-3 mr-1" /> {e.start_date || 'N/A'}</div> },
    { 
      header: 'Consensus', 
      render: (e: Election) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-700">{e.contract_address ? 'Deployed' : 'Pending'}</span>
          <span className="text-[9px] font-mono text-gray-400">{e.contract_address || '---'}</span>
        </div>
      ) 
    },
    { 
      header: 'Metrics', 
      render: (e: Election) => (
        <div className="flex space-x-3">
          <div className="flex items-center text-[10px] font-black uppercase text-blue-500"><BarChart3 className="w-3 h-3 mr-1" /> {e.total_votes || 0} Votes</div>
        </div>
      ) 
    },
    { 
      header: 'Actions', 
      render: (e: Election) => (
        <div className="flex space-x-2">
          {e.status !== 'ACTIVE' && (
            <button 
              onClick={() => handleActivate(e.id)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center shadow-lg shadow-green-600/10"
            >
              <Power className="w-3 h-3 mr-1.5" /> Activate
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg"><ShieldCheck className="w-4 h-4" /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <PageHeader 
          title="Digital Elections" 
          subtitle="Oversee election lifecycles and blockchain consensus layers"
        />
        <Link 
          href="/elections/create"
          className="flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Election
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={elections} 
        isLoading={isLoading} 
        emptyMessage="No digital elections found in the ledger."
      />
    </div>
  );
}
