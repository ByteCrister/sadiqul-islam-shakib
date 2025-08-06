import mongoose from 'mongoose';

const ViewSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
});

const CvSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    active: { type: Boolean, default: false }
});

const UserProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true },
    image: { type: String },
    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials"
    },
    navWords: [{ type: String }],
    heroWords: [{ type: String }],
    cvs: [CvSchema],
    views: [ViewSchema],
}, { timestamps: true });

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
