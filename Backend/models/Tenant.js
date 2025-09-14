import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
});

export default mongoose.model('Tenant', TenantSchema);