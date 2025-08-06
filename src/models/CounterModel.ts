import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    iconName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Counter || mongoose.model('Counter', CounterSchema);
