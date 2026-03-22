'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  isText?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, color, isText = false }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:scale-[1.03] duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">LIVE</span>
      </div>
      <div>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className={`font-black text-gray-900 tracking-tight leading-none truncate ${isText ? 'text-sm' : 'text-3xl'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
