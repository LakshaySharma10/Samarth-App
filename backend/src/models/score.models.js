import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
    {
        interview: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Interview', 
            required: true 
        },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        score: { type: Number, required: true },
        criteria: { type: String, required: true },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('Score', scoreSchema);
