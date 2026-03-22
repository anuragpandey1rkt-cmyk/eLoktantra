'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Upload, X, Save, AlertTriangle } from 'lucide-react';
import backendAPI from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterVoterPage() {
  const router = useRouter();
  const [payload, setPayload] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Assuming a bulk register endpoint
      await backendAPI.post('/voter/register-bulk', JSON.parse(payload));
      toast.success('Voters enrolled successfully');
      router.push('/voters');
    } catch (error) {
      toast.error('Failed to enroll voters. Verify JSON format.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Voter Enrollment" 
        subtitle="Securely register citizens into the digital voter ledger"
      />

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-8">
        <div className="bg-amber-50 p-6 rounded-2xl flex items-start space-x-3 border border-amber-100">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium leading-relaxed">
            Enrollment requires pre-hashed Voter IDs and associated Booth Codes. 
            Ensure the data has been scrubbed for PII before submission.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bulk Data (JSON Format)</label>
          <div className="relative group">
            <div className="absolute top-4 right-4 bg-gray-900 px-3 py-1 rounded text-[8px] font-black text-white uppercase tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
               VOTER_ARRAY_SCHEMA
            </div>
            <textarea 
              required
              rows={12}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full px-8 py-8 bg-gray-900 border border-gray-800 rounded-3xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-mono text-sm text-amber-400 placeholder:text-gray-700 resize-none shadow-inner"
              placeholder={`[
  { "voter_id_hash": "...", "booth_id": "B-101", "election_id": "..." }
]`}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
           <button 
             type="button" 
             onClick={() => router.back()}
             className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center"
           >
             <X className="w-4 h-4 mr-2" /> Discard
           </button>
           <button 
             type="submit" 
             disabled={isSubmitting}
             className="px-10 py-3.5 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 flex items-center"
           >
             <Upload className="w-4 h-4 mr-2" /> {isSubmitting ? 'Enrolling...' : 'Commit to Ledger'}
           </button>
        </div>
      </form>
    </div>
  );
}
