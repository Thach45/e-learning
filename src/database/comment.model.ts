
import { Document, model, models, Schema } from 'mongoose';

export interface TComment extends Document {
    _id: string;
    user: string;
    name: string;
    content: string;
    lesson: string;
    parent?: string;
    created_at: Date;
    replies: TComment[];
}


const commentSchema = new Schema<TComment>({
    user: {
        type:String,
        required: true,
    },
    parent: {
        type: String,
        required: false,
    },
    name: {
        type: String
    },
    content: {
        type: String,
        required: true,
    },
    lesson: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    replies: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment',
        default: [],
    }
})

const Comment = models.Comment || model<TComment>('Comment', commentSchema);

export default Comment;