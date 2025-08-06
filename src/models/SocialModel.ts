import mongoose from 'mongoose';

const SocialSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  iconName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Social || mongoose.model('Social', SocialSchema);
