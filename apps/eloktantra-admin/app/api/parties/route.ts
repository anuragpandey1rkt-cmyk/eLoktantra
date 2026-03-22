import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Party from '@/models/Party';
import { z } from 'zod';

const partySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  abbreviation: z.string().min(1, 'Abbreviation is required'),
  logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color').optional().or(z.literal('')),
  ideology: z.string().optional(),
  founded_year: z.number().optional(),
  headquarters: z.string().optional(),
  president: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const parties = await Party.find({}).sort({ created_at: -1 });
    return NextResponse.json({ success: true, data: parties });
  } catch (error) {
    console.error('API_GET_PARTIES_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = partySchema.parse(body);

    await connectDB();
    const newParty = await Party.create(validatedData);
    return NextResponse.json({ success: true, data: newParty }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('API_POST_PARTY_ERROR:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
