'use client';

export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
    </div>
  );
}
