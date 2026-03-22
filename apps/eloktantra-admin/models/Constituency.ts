import mongoose, { Schema, model, models } from 'mongoose';

const ConstituencySchema = new Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  constituency_number: { type: Number },
  type: { type: String, enum: ['General', 'SC', 'ST'], default: 'General' },
  total_voters: { type: Number },
  district: { type: String },
  description: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default models.Constituency || model('Constituency', ConstituencySchema);
