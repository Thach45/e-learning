
import { ELessonType } from '@/types/enums';
import { Document, model, models, Schema } from 'mongoose';

export interface TLesson extends Document {
    _id: string;
    title: string;
    slug: string;

    course: Schema.Types.ObjectId;
    lecture: Schema.Types.ObjectId;
    order: number;
    duration: number;
    video: string;
    content: string;
    note:{
        user: Schema.Types.ObjectId;
        content: string;
    }
    type: ELessonType;
    created_at: Date;
    deleted: boolean;



}


const lessonSchema = new Schema<TLesson>({

    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    },
    lecture: {
        type: Schema.Types.ObjectId,
        ref: 'lecture',
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    note: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        content: {
            type: String,
            required: true,
        },
    },
    type: {
        type: String,
        enum: Object.values(ELessonType),
        default: ELessonType.VIDEO,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    
    
})

const Lesson = models.Lesson || model<TLesson>('Lesson', lessonSchema);

export default Lesson;