import mongoose, { Schema, model, models } from 'mongoose';

const PartySchema = new Schema({
  name: { type: String, required: true, unique: true },
  abbreviation: { type: String, required: true },
  logo_url: { type: String },
  color: { type: String },
  ideology: { type: String },
  founded_year: { type: Number },
  headquarters: { type: String },
  president: { type: String },
  website: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default models.Party || model('Party', PartySchema);
