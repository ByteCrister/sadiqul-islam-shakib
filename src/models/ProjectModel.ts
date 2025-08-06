import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String },
    fullScreen: { type: String },
    images: [{ type: String }],
    timeline: { type: String },
    features: [{ type: String }],
    challenges: [{ type: String }],
    learnings: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
