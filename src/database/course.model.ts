import { ECourseLevel, ECourseStatus} from '@/types/enums';
import { Document, model, models, Schema } from 'mongoose';

export interface TCourse extends Document {
    _id: string;
    title: string;
    thumbnail: string;
    intro: string;
    description: string;
    price: number;
    sale_price: number;
    slug: string;
    status: ECourseStatus;
    created_at: Date;
    author: Schema.Types.ObjectId;
    students: Schema.Types.ObjectId[];
    views: number;
    level: ECourseLevel;
    rating: number[];
    category: Schema.Types.ObjectId;
    technology: string[];
    info: {
        requirements: string[];
        qa: {
            questions: string;
            answers: string;
        }[];
        benefits: string[];
    }
    lectures: Schema.Types.ObjectId[];
    deleted: boolean;



}


const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        
    },
    intro: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    price: {
        type: Number,
        required: true,
    },
    sale_price: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: Object.values(ECourseStatus),
        default: ECourseStatus.PENDING,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
    }],
    views: {
        type: Number,
        default: 0,
    },
    level: {
        type: String,
        enum: Object.values(ECourseLevel),
        default: ECourseLevel.BEGINNER,
    },
    rating: {
        type: [Number],
        default: [0],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    technology: [{
        type: String,
    }],
    info: {
        requirements: [{
            type: String,
        }],
        qa: [{
            questions: {
                type: String,
            },
            answers: {
                type: String,
            },
        }],
        benefits: [{
            type: String,
        }],
    },
    lectures: [{
        type: Schema.Types.ObjectId,
        ref: 'lecture',
    }],
    deleted: {
        type: Boolean,
        default: false,
    },

    
})

const Course = models.Course || model<TCourse>('Course', courseSchema);

export default Course;