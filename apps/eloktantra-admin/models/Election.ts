import mongoose, { Schema, model, models } from 'mongoose';

const ElectionSchema = new Schema({
  title: { type: String, required: true },
  constituency: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  status: { type: String, enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'], default: 'UPCOMING' },
  contract_address: { type: String },
  total_votes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default models.Election || model('Election', ElectionSchema);
