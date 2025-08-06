import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
    role: { type: String, required: true },
    org: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    points: [{ type: String }],
    iconName: { type: String, required: true }, // Again, just store the name (e.g., 'Briefcase')
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
