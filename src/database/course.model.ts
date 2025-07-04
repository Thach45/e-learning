import { ECourseLevel, ECourseStatus} from '@/types/enums';
import { Document, model, models, Schema } from 'mongoose';

export interface TCourse extends Document {
    _id: string;
    title: string;
    thumbnail: string;
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
    ratings: {
        userId: Schema.Types.ObjectId;
        rating: number;
        created_at: Date;
    }[];
    category: string;
    technology: string[];
    info: {
        requirements: string[];
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
        ref: 'User'
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    ratings: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }],
    category: {
        type: String,
        default: '',
    },
    technology: [{
        type: String,
    }],
    info: {
        requirements: [{
            type: String,
        }],
        benefits: [{
            type: String,
        }],
    },
    lectures: [{
        type: Schema.Types.ObjectId,
        ref: 'Lecture',
    }],
    deleted: {
        type: Boolean,
        default: false,
    },
})

const Course = models.Course || model<TCourse>('Course', courseSchema);

export default Course;