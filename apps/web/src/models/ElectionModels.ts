import mongoose, { Schema, Document, Model } from 'mongoose';

// Electoral Roll (The Source of Truth)
export interface IElectoralRoll extends Document {
  name: string;
  phone: string;
  voterId: string;
  constituency: string;
  isActive: boolean;
}

const ElectoralRollSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  voterId: { type: String, required: true, unique: true },
  constituency: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const ElectoralRoll: Model<IElectoralRoll> = mongoose.models.ElectoralRoll || mongoose.model<IElectoralRoll>('ElectoralRoll', ElectoralRollSchema);

// User Profile (The Authenticated Identity)
export interface IUser extends Document {
  name: string;
  phone: string;
  aadhaarHash?: string;
  constituency: string;
  isVerified: boolean;
  hasVoted: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  aadhaarHash: { type: String },
  constituency: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// OTP Store (The Security Shield)
export interface IOTPStore extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
}

const OTPStoreSchema: Schema = new Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '5m' } } // Auto-expiry mechanism
}, {
  timestamps: true
});

export const OTPStore: Model<IOTPStore> = mongoose.models.OTPStore || mongoose.model<IOTPStore>('OTPStore', OTPStoreSchema);
