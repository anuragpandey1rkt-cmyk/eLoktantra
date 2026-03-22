'use client';

import { Clock, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

const activities = [
  { id: 1, type: 'VOTE_COMMITTED', user: 'Voter: f3b9...92ae', time: '2 mins ago', status: 'success' },
  { id: 2, type: 'SIGNATURE_FAILED', user: 'Voter: a1c2...41d0', time: '8 mins ago', status: 'error' },
  { id: 3, type: 'BOOTH_LOGIN', user: 'Officer: ramanuj_01', time: '15 mins ago', status: 'info' },
  { id: 4, type: 'DUPLICATE_ATTEMPT', user: 'Voter: b2d4...11c9', time: '1 hour ago', status: 'warning' },
  { id: 5, type: 'VOTE_COMMITTED', user: 'Voter: e5f6...33d1', time: '2 hours ago', status: 'success' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">System Audit Log</h3>
          <p className="text-xs font-medium text-gray-400">Most recent actions across the network</p>
        </div>
        <button className="text-[10px] font-black uppercase text-amber-500 hover:underline">View All</button>
      </div>

      <div className="flex-1 space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group hover:border-amber-100 transition-all">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-xl ${
                act.status === 'success' ? 'bg-green-100 text-green-600' :
                act.status === 'error' ? 'bg-red-100 text-red-600' :
                act.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {act.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                 act.status === 'error' ? <ShieldAlert className="w-4 h-4" /> :
                 <AlertCircle className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-900 tracking-widest uppercase">{act.type}</div>
                <div className="text-xs font-medium text-gray-500">{act.user}</div>
              </div>
            </div>
            <div className="flex items-center text-[10px] font-bold text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {act.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
