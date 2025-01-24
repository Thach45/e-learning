
import { Document, model, models, Schema } from 'mongoose';

export interface TLecture extends Document {
    _id: string;
    title: string;
    course: Schema.Types.ObjectId;
    lesson: Schema.Types.ObjectId[];
    created_at: Date;
    order: number;
    deleted: boolean;



}


const lectureSchema = new Schema<TLecture>({
    title: {
        type: String,
        required: true,
        
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    lesson: [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },

    deleted: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        required: true,
    },

    
})

const Lecture = models.Lecture || model<TLecture>('Lecture', lectureSchema);

export default Lecture;