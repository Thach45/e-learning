
import { Document, model, models, Schema } from 'mongoose';

export interface TComment extends Document {
    _id: string;
    user: string;
    content: string;
    lesson: string;
    rating: number;
    created_at: Date;
}


const commentSchema = new Schema<TComment>({
    user: {
        type:String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    lesson: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})

const Comment = models.Comment || model<TComment>('Comment', commentSchema);

export default Comment;