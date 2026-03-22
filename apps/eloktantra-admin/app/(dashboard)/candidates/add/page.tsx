'use client';

import PageHeader from '@/components/layout/PageHeader';
import CandidateForm from '@/components/candidates/CandidateForm';

export default function AddCandidatePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Candidate Nomination" 
        subtitle="Register a new candidate for upcoming democratic elections"
      />
      
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start space-x-4">
        <div className="bg-amber-100 p-3 rounded-2xl">
          <span className="text-xl">🗳️</span>
        </div>
        <div>
          <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Electoral Integrity Notice</h4>
          <p className="text-xs text-amber-700/80 leading-relaxed font-medium mt-1">
            Ensure all legal and financial disclosures match the candidate&apos;s physical nomination papers. 
            Once finalized, this data will be published to the public portal for citizen review.
          </p>
        </div>
      </div>

      <CandidateForm />
    </div>
  );
}
