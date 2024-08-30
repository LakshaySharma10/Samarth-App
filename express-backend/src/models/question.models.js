import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        type: { 
            type: String, 
            enum: ['technical', 'behavioral', 'situational'], 
            required: true 
        },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('Question', questionSchema);
