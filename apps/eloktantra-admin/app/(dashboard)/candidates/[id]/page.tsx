'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import CandidateForm from '@/components/candidates/CandidateForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const { data } = await axios.get(`/api/candidates/${params.id}`);
        setCandidate(data.data);
      } catch (error) {
        toast.error('Failed to load candidate data');
        router.push('/candidates');
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) fetchCandidate();
  }, [params.id]);

  if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner large /></div>;
  if (!candidate) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title={`Edit: ${candidate.name}`}
        subtitle="Modify nomination details and campaign promises"
      />
      
      <CandidateForm initialData={candidate} id={params.id as string} />
    </div>
  );
}
