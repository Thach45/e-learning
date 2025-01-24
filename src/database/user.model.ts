import { EUserRole, EUserStatus } from '@/types/enums';
import { Document, model, models, Schema } from 'mongoose';

export interface TUser extends Document {
    clerkId: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    courses: Schema.Types.ObjectId[];
    status: EUserStatus;
    role: EUserRole;
    created_at: Date;
}


const userSchema = new Schema<TUser>({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    status: { type: String, enum: Object.values(EUserStatus), default: EUserStatus.ACTIVE },
    role: { type: String, enum: Object.values(EUserRole), default: EUserRole.USER },
    created_at: { type: Date, default: Date.now },
})

const User = models.User || model<TUser>('User', userSchema);


export default User;