'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEMO_REPORTER_ID =
  process.env.NEXT_PUBLIC_DEMO_REPORTER_ID || 'db7a4175-91fb-40d2-97ab-afaa1febdcdc';

interface Issue {
  id: string;
  location: string;
  constituency: string;
  issue_type: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
}

interface CreateIssueInput {
  location: string;
  constituency: string;
  issue_type: string;
  description: string;
  reported_by_uuid: string;
}

export default function IssuesPage() {
  const [location, setLocation] = useState('');
  const [constituency, setConstituency] = useState('');
  const [issueType, setIssueType] = useState('Roads');
  const [description, setDescription] = useState('');

  const { data: issues, refetch } = useQuery<Issue[]>({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/issues`);
      return (data.issues || []) as Issue[];
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (newIssue: CreateIssueInput) => {
      const { data } = await axios.post(`${API_URL}/issues`, newIssue);
      return data;
    },
    onSuccess: () => {
      refetch();
      setDescription('');
      setLocation('');
      setConstituency('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate({
      location,
      constituency,
      issue_type: issueType,
      description,
      reported_by_uuid: DEMO_REPORTER_ID,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Civic Issue Reporting</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Report a New Problem</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Assi Ghat, Varanasi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Constituency</label>
                <input
                  type="text"
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Varanasi"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Roads</option>
                  <option>Water Supply</option>
                  <option>Electricity</option>
                  <option>Sanitation</option>
                  <option>Public Safety</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-32"
                placeholder="Describe the issue in detail..."
                required
              />
            </div>
            <button 
              type="submit"
              disabled={reportMutation.isPending}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold mb-6">Recent Reports</h2>
        <div className="space-y-4">
          {issues?.map((issue) => (
            <div key={issue.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {issue.issue_type}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    issue.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{issue.location}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{issue.constituency}</p>
                <p className="text-gray-600 mt-1">{issue.description}</p>
              </div>
              <div className="text-right text-sm text-gray-400">
                {new Date(issue.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
