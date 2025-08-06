import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconName: { type: String, required: true }, // Store icon name instead of JSX component
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
