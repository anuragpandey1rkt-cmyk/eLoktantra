import mongoose, { Schema, Document, Model } from 'mongoose';

// ════════════════════════════════════════════════════
// ELECTION MODEL
// ════════════════════════════════════════════════════
export interface IElection extends Document {
  title: string;
  constituency: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ElectionSchema = new Schema<IElection>({
  title:        { type: String, required: true, trim: true },
  constituency: { type: String, required: true, trim: true },
  startDate:    { type: Date,   required: true },
  endDate:      { type: Date,   required: true },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

ElectionSchema.index({ constituency: 1, isActive: 1 });

export const Election: Model<IElection> =
  mongoose.models.Election || mongoose.model<IElection>('Election', ElectionSchema);

// ════════════════════════════════════════════════════
// VOTE MODEL
// ════════════════════════════════════════════════════
export interface IVote extends Document {
  userId:          mongoose.Types.ObjectId;
  candidateId:     mongoose.Types.ObjectId;
  electionId:      mongoose.Types.ObjectId;
  constituency:    string;
  blockchainHash:  string;
  blockchainStatus:'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt:       Date;
}

const VoteSchema = new Schema<IVote>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User',      required: true },
  candidateId:     { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  electionId:      { type: Schema.Types.ObjectId, ref: 'Election',  required: true },
  constituency:    { type: String, required: true },
  blockchainHash:  { type: String, default: '' },
  blockchainStatus:{ type: String, enum: ['PENDING','CONFIRMED','FAILED'], default: 'PENDING' },
}, { timestamps: true });

// One vote per user per election — enforced at DB level
VoteSchema.index({ userId: 1, electionId: 1 }, { unique: true });
VoteSchema.index({ electionId: 1, candidateId: 1 });

export const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);

// ════════════════════════════════════════════════════
// ISSUE MODEL
// ════════════════════════════════════════════════════
export interface IIssue extends Document {
  title:        string;
  description:  string;
  location:     string;
  constituency: string;
  issueType:    string;
  status:       'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  reportedBy?:  mongoose.Types.ObjectId;
  createdAt:    Date;
  updatedAt:    Date;
}

const IssueSchema = new Schema<IIssue>({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  location:     { type: String, required: true },
  constituency: { type: String, required: true },
  issueType:    { type: String, required: true, enum: ['Roads','Water','Electricity','Sanitation','Healthcare','Education','Other'] },
  status:       { type: String, enum: ['OPEN','IN_PROGRESS','RESOLVED'], default: 'OPEN' },
  reportedBy:   { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

IssueSchema.index({ constituency: 1, status: 1 });

export const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

// ════════════════════════════════════════════════════
// PROMISE MODEL
// ════════════════════════════════════════════════════
export interface IPromise extends Document {
  candidateId:  mongoose.Types.ObjectId;
  electionId?:  mongoose.Types.ObjectId;
  constituency: string;
  title:        string;
  description:  string;
  progress:     number; // 0-100
  status:       'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BROKEN';
  deadline?:    Date;
  createdAt:    Date;
  updatedAt:    Date;
}

const PromiseSchema = new Schema<IPromise>({
  candidateId:  { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  electionId:   { type: Schema.Types.ObjectId, ref: 'Election' },
  constituency: { type: String, required: true },
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  progress:     { type: Number, default: 0, min: 0, max: 100 },
  status:       { type: String, enum: ['NOT_STARTED','IN_PROGRESS','COMPLETED','BROKEN'], default: 'NOT_STARTED' },
  deadline:     { type: Date },
}, { timestamps: true });

PromiseSchema.index({ candidateId: 1 });
PromiseSchema.index({ constituency: 1, status: 1 });

export const Promise: Model<IPromise> =
  mongoose.models.Promise || mongoose.model<IPromise>('Promise', PromiseSchema);
