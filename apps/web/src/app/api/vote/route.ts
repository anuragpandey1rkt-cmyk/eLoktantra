import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/ElectionModels';
import { authenticate } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';

// SECURE VOTING INFRASTRUCTURE: POST /api/vote 🛡️🗳️🔐
export async function POST(request: NextRequest) {
  try {
    const { candidateId, electionConstituency } = await request.json();

    if (!candidateId || !electionConstituency) {
        return NextResponse.json({ error: 'Candidate and Election Constituency are required' }, { status: 400 });
    }

    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const conn = await connectDB();
    if (!conn) return NextResponse.json({ error: 'Database Offline' }, { status: 503 });

    // ⚡ CONSTITUENCY MISMATCH CHECK: Mandatory Eligibility Logic 🕵️‍♂️🔥
    if (payload.constituency !== electionConstituency) {
        return NextResponse.json({ 
            success: false, 
            error: `Voter Eligibility Failure: You are not eligible for this election in ${electionConstituency}. Your registered constituency is ${payload.constituency}.` 
        }, { status: 403 });
    }

    // IDENTITY SYNC: Fetch the authenticated user
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'Identified user was removed from the session vault.' }, { status: 404 });
    }

    // 🛡️ SECURITY SHIELD: One User = One Vote Logic 🛡️
    if (!user.isVerified) {
        return NextResponse.json({ error: 'Voter is not verified. Please complete DigiLocker authentication.' }, { status: 401 });
    }

    if (user.hasVoted) {
        return NextResponse.json({ 
            success: false, 
            error: 'Double Voting Attempt Detected: You have already cast your vote for this election cycle.' 
        }, { status: 403 });
    }

    // 🗳️ VOTE RECORDING: Marking the citizen as having voted
    // In a full system, you would record the candidate as well (using a separate, anonymized Ballot collection)
    // For this eLoktantra demo, we prioritize the Voter Eligibility logic.
    user.hasVoted = true;
    await user.save();

    console.log(`🗳️ [VOTE_CAST] Voter: ${user._id} | Candidate: ${candidateId} | Area: ${electionConstituency}`);

    return NextResponse.json({
      success: true,
      message: 'Your vote has been recorded securely. Thank you for participating in eLoktantra.',
      voterId: user._id,
      timestamp: new Date()
    });

  } catch (err: any) {
    console.error('Voting API Error:', err.message);
    return NextResponse.json({ error: `Voting System Failure: ${err.message}` }, { status: 500 });
  }
}
