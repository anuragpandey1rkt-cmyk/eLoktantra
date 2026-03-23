import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// ═══════════════════════════════════════════════════════
// ELOKTANTRA UNIFIED DATABASE BRIDGE 🛡️🔐⚡
// Provides BOTH Mongoose (for models) AND MongoClient (for direct ops)
// ═══════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://eloktantra:tonicsteamtech@cluster0.bzfsujx.mongodb.net/eloktantra?retryWrites=true&w=majority&appName=Cluster0';

// ─── MONGOOSE CONNECTION (for ElectionModels) ──────────────────────────────
let mongooseCache = (global as any)._mongooseCache;

if (!mongooseCache) {
  mongooseCache = (global as any)._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = { bufferCommands: false };
    mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).catch((err) => {
      console.error('❌ Mongoose Connect Error:', err.message);
      mongooseCache.promise = null;
      return null;
    });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
    if (mongooseCache.conn) {
      console.log('✅ Mongoose: Connected to MongoDB');
    }
  } catch (e: any) {
    console.error('❌ Mongoose connection failed:', e.message);
    mongooseCache.promise = null;
  }

  return mongooseCache.conn;
}

// ─── MONGO CLIENT (for direct collection access) ───────────────────────────
let clientCache: MongoClient | null = null;
let clientFailed = false;

export async function getClient(): Promise<MongoClient | null> {
  // If the last attempt succeeded, reuse
  if (clientCache) {
    try {
      await clientCache.db().admin().command({ ping: 1 });
      return clientCache;
    } catch {
      // Connection died, reset cache
      clientCache = null;
      clientFailed = false;
    }
  }

  // Don't retry if already failed this cycle (prevents spam)
  if (clientFailed) return null;

  try {
    console.log('🌍 ATLAS: Initiating secure handshake...');
    const newClient = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4 on Windows
    } as any);

    await newClient.connect();
    clientCache = newClient;
    console.log('✅ MongoClient: Cloud connection ACTIVE!');
    return clientCache;
  } catch (err: any) {
    console.error('❌ MongoClient connection failed:', err.message);
    clientFailed = true;
    // Reset after 30 seconds to allow retry
    setTimeout(() => { clientFailed = false; }, 30000);
    return null;
  }
}

// ─── BACKWARDS COMPATIBLE EXPORTS ─────────────────────────────────────────
// Many routes import `clientPromise` — this satisfies them.
const clientPromise: Promise<MongoClient | null> = getClient();

export default clientPromise;
