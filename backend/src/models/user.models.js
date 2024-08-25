import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['candidate', 'interviewer', 'admin'], required: true },
        resume: { type: String }, // URL or path to resume
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('User', userSchema);

