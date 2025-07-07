
import mongoose, { model, models, Schema, Document } from "mongoose";

export interface TProgress extends Document {
    userId: string;
    courseId: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
    completed: boolean;
    watchTime: number;
    watchedPercent: number;
    lastPosition: number;
    completedAt: Date;
}

const progressSchema = new Schema({
  userId: {
    type: String, // Clerk ID là string
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchTime: {
    type: Number,
    default: 0
  },
  watchedPercent: {
    type: Number,
    default: 0
  },
  lastPosition: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

progressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

// Kiểm tra xem model đã tồn tại trong mongoose.models chưa
const Progress = models?.Progress || model<TProgress>("Progress", progressSchema);

export default Progress; 