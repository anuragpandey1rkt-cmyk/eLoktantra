import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Party from '@/models/Party';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();
    const updatedParty = await Party.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedParty) return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updatedParty });
  } catch (error: any) {
    console.error('API_PUT_PARTY_ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const deletedParty = await Party.findByIdAndDelete(params.id);
    if (!deletedParty) return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Party deleted successfully' });
  } catch (error: any) {
    console.error('API_DELETE_PARTY_ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
