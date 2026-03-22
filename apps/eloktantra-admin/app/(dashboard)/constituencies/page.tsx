'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import PageHeader from '@/components/layout/PageHeader';
import { Plus, Trash2, Edit2, Map } from 'lucide-react';
import { Constituency } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Modal from '@/components/shared/Modal';
import ConstituencyForm from '@/components/constituencies/ConstituencyForm';

export default function ConstituenciesPage() {
  const [constituencies, setConstituencies] = useState<Constituency[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingConstituency, setEditingConstituency] = useState<Constituency | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchConstituencies = async () => {
    try {
      const { data } = await axios.get('/api/constituencies');
      setConstituencies(data.data);
    } catch (error) {
      toast.error('Failed to load constituencies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConstituencies();
  }, []);

  const handleDelete = async () => {
    if (!isDeleting) return;
    try {
      await axios.delete(`/api/constituencies/${isDeleting}`);
      toast.success('Constituency removed');
      fetchConstituencies();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(null);
    }
  };

  const columns = [
    { header: 'Number', render: (c: Constituency) => <span className="font-bold text-amber-600">#{c.constituency_number || 'N/A'}</span> },
    { header: 'Name', render: (c: Constituency) => <span className="font-bold text-gray-900">{c.name}</span> },
    { header: 'State', render: (c: Constituency) => c.state },
    { 
      header: 'Type', 
      render: (c: Constituency) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
          c.type === 'General' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
        }`}>
          {c.type}
        </span>
      ) 
    },
    { header: 'Total Voters', render: (c: Constituency) => c.total_voters?.toLocaleString() || '0' },
    { 
      header: 'Actions', 
      render: (c: Constituency) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => setEditingConstituency(c)}
            className="p-2 hover:bg-amber-50 text-gray-400 hover:text-amber-500 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
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
          title="Constituencies" 
          subtitle="Manage electoral boundaries and voter demographics"
        />
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Constituency
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={constituencies} 
        isLoading={isLoading} 
        emptyMessage="No constituencies defined yet."
      />

      <ConfirmDialog 
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Constituency"
        message="Are you sure? This will remove the constituency. Any candidates assigned here will need to be re-assigned."
      />
      
      <Modal 
        isOpen={isAddModalOpen || !!editingConstituency} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingConstituency(null);
        }}
        title={editingConstituency ? "Edit Constituency" : "Create Constituency"}
      >
        <ConstituencyForm 
          initialData={editingConstituency}
          onSuccess={() => {
            setIsAddModalOpen(false);
            setEditingConstituency(null);
            fetchConstituencies();
          }} 
        />
      </Modal>
    </div>
  );
}
