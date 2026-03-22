import mongoose, { Schema, model, models } from 'mongoose';

const VoterSchema = new Schema({
  voter_id_hash: { type: String, required: true, unique: true },
  booth_id: { type: String, required: true },
  has_voted: { type: Boolean, default: false },
  election_id: { type: String },
  registered_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default models.Voter || model('Voter', VoterSchema);
