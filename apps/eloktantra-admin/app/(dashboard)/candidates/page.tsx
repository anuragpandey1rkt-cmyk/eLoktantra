'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/layout/PageHeader';
import { Plus, Trash2, Edit2, User, Search, Filter } from 'lucide-react';
import { Candidate } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Link from 'next/link';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCandidates = async () => {
    try {
      const { data } = await axios.get(`/api/candidates${searchTerm ? `?search=${searchTerm}` : ''}`);
      setCandidates(data.data);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!isDeleting) return;
    try {
      await axios.delete(`/api/candidates/${isDeleting}`);
      toast.success('Candidate removed');
      fetchCandidates();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(null);
    }
  };

  const columns = [
    { 
      header: 'Profile', 
      render: (c: Candidate) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 flex items-center justify-center overflow-hidden">
            {c.photo_url ? (
              <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900">{c.name}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">{c.gender}, {c.age} yrs</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Party', 
      render: (c: Candidate) => (
        <div className="flex items-center">
          <span className="font-bold text-gray-700">{c.party}</span>
        </div>
      ) 
    },
    { header: 'Constituency', render: (c: Candidate) => <span className="text-gray-600">{c.constituency}</span> },
    { 
      header: 'Legal', 
      render: (c: Candidate) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
          c.criminal_cases > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {c.criminal_cases} Cases
        </span>
      ) 
    },
    { header: 'Net Worth', render: (c: Candidate) => <span className="font-medium text-gray-900">{c.net_worth || 'N/A'}</span> },
    { 
      header: 'Actions', 
      render: (c: Candidate) => (
        <div className="flex space-x-2">
          <Link href={`/candidates/${c._id}`} className="p-2 hover:bg-amber-50 text-gray-400 hover:text-amber-500 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setIsDeleting(c._id)}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <PageHeader 
          title="Candidates Management" 
          subtitle="Register and manage profiles for all contesting candidates"
        />
        <Link 
          href="/candidates/add"
          className="flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nominate Candidate
        </Link>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, party or constituency..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-100 text-gray-500 text-sm font-bold rounded-2xl hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={candidates} 
        isLoading={isLoading} 
        emptyMessage="No candidates nominated yet."
      />

      <ConfirmDialog 
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        onConfirm={handleDelete}
        title="Remove Nomination"
        message="Are you sure you want to withdraw this candidate's nomination? All their manifesto details and campaign history will be removed."
      />
    </div>
  );
}
