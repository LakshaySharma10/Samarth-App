import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        scheduledAt: { type: Date, required: true },
        interviewer: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        candidate: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        questions: [{ type: String }], // List of questions (predefined or AI-generated)
        status: { 
            type: String, 
            enum: ['scheduled', 'completed', 'canceled'], 
            default: 'scheduled' 
        },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('Interview', interviewSchema);
