'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ManifestoComparisonEntry {
  manifesto_id: string;
  party: string;
  summary: string;
  policy_text: string;
}

interface ManifestoComparisonCategory {
  category: string;
  insight: string;
  manifestos: ManifestoComparisonEntry[];
}

export default function CompareManifestosPage() {
  const { data: categories, isLoading } = useQuery<ManifestoComparisonCategory[]>({
    queryKey: ['manifesto-comparison'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/manifestos/compare`);
      return (data.categories || []) as ManifestoComparisonCategory[];
    }
  });

  if (isLoading) return <div className="p-12 text-center text-gray-500">Comparing manifestos with AI...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Manifesto Comparison</h1>
          <p className="text-lg text-gray-600 mt-2">Compare party policies side-by-side across key sectors.</p>
        </header>

        <div className="space-y-12">
          {(categories || []).map((categoryBlock) => (
            <section key={categoryBlock.category}>
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 mb-6 uppercase tracking-widest text-sm">
                {categoryBlock.category}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{categoryBlock.insight}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryBlock.manifestos.map((policy) => (
                  <div key={policy.manifesto_id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {policy.party[0]}
                      </div>
                      <h3 className="font-bold text-gray-900">{policy.party}</h3>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-700 italic mb-4 leading-relaxed">
                        {policy.policy_text.substring(0, 150)}...
                      </p>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-xs font-bold text-blue-800 uppercase mb-2">AI Summary</p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          {policy.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
