import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ElectoralRoll, User } from '@/models/ElectionModels';
import crypto from 'crypto';

/**
 * Helper to create a cryptographic bind hash
 */
function createBindHash(parts: string[]): string {
  return crypto.createHash('sha256').update(parts.join('|')).digest('hex');
}

/**
 * POST /api/digilocker/verify
 * Fetches real citizen data from MongoDB (Electoral Roll) 
 * to power the DigiLocker Mock.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { identifier, voterId, voterName, constituency, deviceId } = await request.json(); 

    if (!identifier && !voterId && !voterName) {
      return NextResponse.json({ success: false, error: 'Identifier required' }, { status: 400 });
    }

    // 1. Search in PostgreSQL (Mapped via Node API)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-elokantra.onrender.com';
    let voter: any = null;

    try {
      // Primary Search: Standard Identifier (Phone)
      const dbResponse = await fetch(`${baseUrl}/api/voter/find`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const dbData = await dbResponse.json();
      
      let foundVoter = dbData.success && dbData.voter ? dbData.voter : null;

      // Secondary Search: Try with Voter ID if provided
      if (!foundVoter && voterId) {
        const altResponse = await fetch(`${baseUrl}/api/voter/find`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: voterId.trim().toUpperCase() })
        });
        const altData = await altResponse.json();
        if (altData.success && altData.voter) foundVoter = altData.voter;
      }

      // Final Search: Fallback to name/phone check if both identifiers weren't exact
      if (!foundVoter && (identifier || voterName)) {
         // Try searching by phone/identifier
         const searchParam = identifier?.replace(/\D/g, '') || voterName;
         const finalResponse = await fetch(`${baseUrl}/api/voter/find`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: searchParam })
        });
        const finalData = await finalResponse.json();
        if (finalData.success && finalData.voter) foundVoter = finalData.voter;
      }

      if (foundVoter) {
        // Handle both encrypted and plain names for migration robustness
        let decodedName = foundVoter.name;
        if (foundVoter.name_encrypted) {
           try { decodedName = Buffer.from(foundVoter.name_encrypted, 'base64').toString('utf-8'); } catch(e) {}
        }
        
        voter = {
          name: decodedName || identifier,
          phone: foundVoter.phone || identifier.replace(/\D/g, ''),
          voterId: foundVoter.voter_id || identifier,
          aadhaarHash: foundVoter.voter_id_hash || foundVoter.voter_id,
          constituencyId: foundVoter.constituency || foundVoter.booth_id || 'c11111111111111111111111',
          faceEmbedding: new Array(128).fill(0.1),
          address: 'Verified Voter Address'
        };
      }
    } catch (e) {
      console.warn('Backend reachability issue for voter/find');
    }

    if (!voter) {
      return NextResponse.json({ 
        success: false, 
        error: "Access Denied: You are not registered in the National Electoral Roll." 
      }, { status: 403 });
    }

    // 2. Initialize Session Binding (SESSION LOCK)
    const sessionId = crypto.randomUUID();
    const faceHash = createBindHash([Array.isArray(voter.faceEmbedding) ? JSON.stringify(voter.faceEmbedding) : voter.faceEmbedding]);
    const tokenHash = createBindHash([voter.voterId, deviceId || 'UNKNOWN_DEVICE', sessionId]);

    // 3. Register/Update Active User Session
    const userSession = await User.findOneAndUpdate(
      { phone: voter.phone },
      { 
        $set: { 
          name: voter.name,
          phone: voter.phone,
          aadhaarHash: voter.aadhaarHash,
          constituencyId: voter.constituencyId,
          isVerified: false,
          suspicious: false,
          lastLoginIP: request.headers.get('x-forwarded-for') || '127.0.0.1',
          
          deviceId: deviceId || 'UNKNOWN_DEVICE',
          sessionId,
          faceHash,
          tokenHash,
          
          locationStatus: 'PENDING',
          sessionFaceEmbedding: Array.isArray(voter.faceEmbedding) ? JSON.stringify(voter.faceEmbedding) : voter.faceEmbedding 
        }
      },
      { upsert: true, new: true }
    );

    // 3. Return real data to the mock UI
    return NextResponse.json({
      success: true,
      user: {
        id: userSession._id,
        name: voter.name,
        aadhaarNumber: `XXXX XXXX ${voter.phone.slice(-4)}`,
        mobileNumber: voter.phone,
        address: voter.address,
        constituencyId: voter.constituencyId,
        faceEmbedding: voter.faceEmbedding,
        deviceId: userSession.deviceId,
        sessionId: userSession.sessionId,
        documents: [
          {
            id: 'aadhaar-1',
            name: `${voter.name} Aadhaar Card`,
            type: 'Aadhaar',
            verified: true,
            uploadedAt: (voter as any).createdAt?.toISOString() || new Date().toISOString()
          },
          {
            id: 'voter-1',
            name: `Voter ID CARD - ${voter.voterId}`,
            type: 'Voter ID',
            verified: true,
            uploadedAt: (voter as any).createdAt?.toISOString() || new Date().toISOString()
          }
        ]
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
