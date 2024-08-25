import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        interview: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Interview', 
            required: true 
        },
        messages: [{ type: String }],
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model('Chat', chatSchema);
