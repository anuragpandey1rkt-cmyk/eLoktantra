'use client';

import { Bell, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm font-medium text-gray-400">
          <span className="hover:text-amber-500 cursor-pointer transition-colors">Admin</span>
          {segments.map((segment) => (
            <div key={segment} className="flex items-center">
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900 capitalize font-bold">{segment}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search system..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all w-64"
          />
        </div>

        <button className="relative text-gray-400 hover:text-amber-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-6 bg-gray-100 mx-2"></div>

        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-black text-gray-900 uppercase tracking-tight">System Admin</div>
            <div className="text-[10px] text-green-500 font-bold uppercase leading-none mt-0.5 animate-pulse">Online</div>
          </div>
        </div>
      </div>
    </header>
  );
}
