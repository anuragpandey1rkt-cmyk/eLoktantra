import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Constituency from '@/models/Constituency';
import { z } from 'zod';

const constituencySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  state: z.string().min(1, 'State is required'),
  constituency_number: z.number().optional(),
  type: z.enum(['General', 'SC', 'ST']).default('General'),
  total_voters: z.number().optional(),
  district: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const constituencies = await Constituency.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: constituencies });
  } catch (error) {
    console.error('API_GET_CONSTITUENCIES_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = constituencySchema.parse(body);

    await connectDB();
    const newConstituency = await Constituency.create(validatedData);
    return NextResponse.json({ success: true, data: newConstituency }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('API_POST_CONSTITUENCY_ERROR:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
