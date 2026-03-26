'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PieChart, ShieldCheck, Users, Activity } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-elokantra.onrender.com';

interface CandidateCount {
  candidate_name: string;
  vote_count: number;
}

export default function ElectionCountsPage() {
  const params = useParams();
  const id = params.id as string;
  const [counts, setCounts] = useState<CandidateCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/admin/results?electionId=${id}`);
      if (res.data.success) {
        setCounts(res.data.results);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching real-time counts from PostgreSQL');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 5000); // 5 sec live refresh
    return () => clearInterval(interval);
  }, [id]);

  if (loading && counts.length === 0) return <div className="p-10 text-center animate-pulse text-gray-500">Loading Real-Time PSQL Counts...</div>;
  if (error) return <div className="p-10 text-red-500 font-bold">{error}</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8 text-black">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
           <h1 className="text-3xl font-black flex items-center gap-3">
             <PieChart className="w-8 h-8 text-blue-600" />
             Live Election Tally
           </h1>
           <p className="text-gray-500 font-medium mt-2">Querying PostgreSQL DB in Real-Time</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-blue-100">
           <Activity className="w-5 h-5 animate-pulse" />
           <span className="text-sm font-bold uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="grid gap-6">
        {counts.length === 0 ? (
           <div className="p-10 bg-gray-50 rounded-2xl text-center text-gray-500 font-medium border border-gray-200">
               No votes have been cast yet.
           </div>
        ) : counts.sort((a, b) => b.vote_count - a.vote_count).map((c, i) => (
           <div key={c.candidate_name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-xl text-gray-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Candidate</p>
                    <p className="text-lg font-bold text-gray-900">{c.candidate_name}</p>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-4xl font-black text-gray-900">{c.vote_count}</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verified Votes</p>
              </div>
           </div>
        ))}
      </div>

      <button onClick={fetchCounts} className="w-full py-4 rounded-2xl font-bold bg-gray-900 text-white hover:bg-black transition-colors shadow-lg active:scale-95">
         Manual Refresh
      </button>
    </div>
  );
}
