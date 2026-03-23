import { NextResponse } from 'next/server';
import { ElectoralRoll, User, OTPStore } from '@/models/ElectionModels';
import { signToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';

// MOCK DIGILOCKER VERIFY: Step 2 (OTP Validation + Identity Sync) 🕵️‍♂️🛡️🔐
export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });

    // 🛡️ MONGOOSE CONNECTION BRIDGE
    const conn = await connectDB();
    if (!conn) return NextResponse.json({ error: 'Database Offline' }, { status: 503 });

    // 🛡️ OTP VALIDATION SHIELD: Validate the correct security code
    const otpRecord = await OTPStore.findOne({ phone, otp, expiresAt: { $gt: new Date() } });

    if (!otpRecord) {
        return NextResponse.json({ error: 'Invalid or Expired OTP. Please request a new one.' }, { status: 401 });
    }

    // IDENTITY SYNC: Fetch person from ElectoralRoll
    const person = await ElectoralRoll.findOne({ phone, isActive: true });

    if (!person) {
        return NextResponse.json({ error: 'User registration was revoked during authentication.' }, { status: 410 });
    }

    // USER REGISTRATION: Create local verified session user
    let user = await User.findOne({ phone });

    if (!user) {
        user = await User.create({
            name: person.name,
            phone: person.phone,
            constituency: person.constituency,
            isVerified: true,
            hasVoted: false,
        });
    } else {
        // Ensure their verified state is up to date
        user.isVerified = true;
        await user.save();
    }

    // 🏆 CRYPTOGRAPHIC TOKEN: Issue JWT for the election session
    const token = signToken({ 
        userId: user._id.toString(), 
        phone: user.phone, 
        constituency: user.constituency 
    });

    // Revoke the OTP after successful verification
    await OTPStore.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({
      success: true,
      message: 'Citizen identity verified successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        constituency: user.constituency,
        isVerified: user.isVerified,
        hasVoted: user.hasVoted
      }
    });

  } catch (err: any) {
    console.error('Verification Error:', err.message);
    return NextResponse.json({ error: `Verification System Failure: ${err.message}` }, { status: 500 });
  }
}
