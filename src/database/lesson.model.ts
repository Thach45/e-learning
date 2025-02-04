
import { ELessonType, EVideoType } from '@/types/enums';
import { Document, model, models, Schema } from 'mongoose';

export interface TLesson extends Document {
    _id: string;
    title: string;
    slug: string;
    course: Schema.Types.ObjectId;
    lecture: Schema.Types.ObjectId;
    order: number;
    duration: number;
    videoType: EVideoType;
    videoURL: string;
    attachment: {
        title: string;
        url: string;
    }
    content: string;
    description: string;
    comment: Schema.Types.ObjectId[];
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
        ref: 'Course',
        required: true,
    },
    attachment: {
        title: {
            type: String,
            default: '',
        },
        url: {
            type: String,
            default: '',
        },
    },
    lecture: {
        type: Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        default: 0,
        required: true,
        
    },
    videoType: {
        type: String,
        enum: Object.values(EVideoType),
        default: EVideoType.DRIVE,
        required: true,
    },
    videoURL: {
        type: String,
        
        default: '',
    },
    content: {
        type: String,
        
        default: '',
        
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],

    description: {
        type: String,
        default: '',
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