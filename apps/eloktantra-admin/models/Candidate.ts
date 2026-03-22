import mongoose, { Schema, model, models } from 'mongoose';

const CandidateSchema = new Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  partyId: { type: Schema.Types.ObjectId, ref: 'Party', required: true },
  constituency: { type: String, required: true },
  constituencyId: { type: Schema.Types.ObjectId, ref: 'Constituency', required: true },
  photo_url: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  education: { type: String },
  net_worth: { type: String },
  criminal_cases: { type: Number, default: 0 },
  criminal_details: { type: String },
  manifesto_summary: { type: String },
  promises: [{
    title: { type: String },
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' }
  }],
  previous_terms: { type: Number, default: 0 },
  social_links: {
    twitter: { type: String },
    facebook: { type: String },
    website: { type: String }
  },
  election_id: { type: String }, // UUID from NestJS
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default models.Candidate || model('Candidate', CandidateSchema);
