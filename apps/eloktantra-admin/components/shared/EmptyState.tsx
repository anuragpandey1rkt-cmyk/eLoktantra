'use client';

import { Layers } from 'lucide-react';

export default function EmptyState({ message = 'No records found' }: { message?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-dotted border-gray-200 p-20 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
        <Layers className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">No Data Available</h3>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
  );
}
