
import { Document, model, models, Schema } from 'mongoose';

export interface TCategory extends Document {
    _id: string;
    title: string;
    courses: Schema.Types.ObjectId[];
    created_at: Date;
    deleted: boolean;
}


const categorySchema = new Schema<TCategory>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    courses: {
        type: [Schema.Types.ObjectId],
        ref: 'Course',
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
  
})

const Category = models.Category || model<TCategory>('Category', categorySchema);

export default Category;