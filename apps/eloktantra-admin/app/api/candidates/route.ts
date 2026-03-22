import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import { z } from 'zod';

const candidateSchema = z.object({
  name: z.string().min(1),
  party: z.string().min(1),
  partyId: z.string().min(1),
  constituency: z.string().min(1),
  constituencyId: z.string().min(1),
  photo_url: z.string().url().optional().or(z.literal('')),
  age: z.number().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  education: z.string().optional(),
  net_worth: z.string().optional(),
  criminal_cases: z.number().default(0),
  criminal_details: z.string().optional(),
  manifesto_summary: z.string().optional(),
  promises: z.array(z.object({
    title: z.string(),
    status: z.enum(['Pending', 'InProgress', 'Completed'])
  })).optional(),
  social_links: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional()
  }).optional(),
  election_id: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const party = searchParams.get('party');
  const constituency = searchParams.get('constituency');
  const search = searchParams.get('search');

  const query: any = {};
  if (party) query.partyId = party;
  if (constituency) query.constituencyId = constituency;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { party: { $regex: search, $options: 'i' } },
      { constituency: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    await connectDB();
    const candidates = await Candidate.find(query).sort({ name: 1 });
    return NextResponse.json({ success: true, data: candidates });
  } catch (error) {
    console.error('API_GET_CANDIDATES_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = candidateSchema.parse(body);

    await connectDB();
    const newCandidate = await Candidate.create(validatedData);
    return NextResponse.json({ success: true, data: newCandidate }, { status: 201 });
  } catch (error: any) {
    console.error('API_POST_CANDIDATE_ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
