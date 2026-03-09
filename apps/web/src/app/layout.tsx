import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './client-providers';

export const metadata: Metadata = {
  title: 'eLoktantra | Election Transparency',
  description: 'A civic-tech platform for democratizing election data and issue reporting in India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
