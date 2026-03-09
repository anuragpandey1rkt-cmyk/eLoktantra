'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function PromisesPage() {
  const { data: promises, isLoading } = useQuery({
    queryKey: ['promises'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/promises`);
      return data.promises;
    }
  });

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading promises...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Promise Tracker</h1>
          <p className="text-lg text-gray-600 mt-2">Hold your representatives accountable. Track the progress of election promises.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promises?.map((promise: any) => (
            <div key={promise.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{promise.candidates?.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{promise.candidates?.party}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  promise.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  promise.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {promise.status}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{promise.description}"
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Progress</span>
                  <span>{promise.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${promise.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {promises?.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            No promises tracked yet.
          </div>
        )}
      </div>
    </div>
  );
}
