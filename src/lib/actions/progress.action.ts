"use server";

import mongoose from 'mongoose';
import { connectToData } from "@/lib/mongoose";
import Progress from "@/database/progress.model";

// Interface cho kết quả trả về sau khi dùng lean()
interface IProgressDoc {
  _id: mongoose.Types.ObjectId;
  userId: string;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  watchTime: number;
  watchedPercent: number;
  lastPosition: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function markLessonAsCompleted(
  userId: string,
  courseId: string,
  lessonId: string,
  isCompleted: boolean
) {
  try {
    connectToData();

    const progress = await Progress.findOneAndUpdate(
      { 
        userId,
        courseId: new mongoose.Types.ObjectId(courseId),
        lessonId: new mongoose.Types.ObjectId(lessonId)
      },
      { 
        $set: { 
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null
        }
      },
      { upsert: true, new: true }
    ).lean() as unknown as IProgressDoc;

    if (progress) {
      return {
        ...progress,
        _id: progress._id.toString(),
        courseId: progress.courseId.toString(),
        lessonId: progress.lessonId.toString()
      };
    }

    return null;
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    throw error;
  }
}

export async function getLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string
) {
  try {
    connectToData();

    const progress = await Progress.findOne({
      userId,
      courseId: new mongoose.Types.ObjectId(courseId),
      lessonId: new mongoose.Types.ObjectId(lessonId)
    }).lean() as unknown as IProgressDoc;

    if (progress) {
      return {
        ...progress,
        _id: progress._id.toString(),
        courseId: progress.courseId.toString(),
        lessonId: progress.lessonId.toString()
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    throw error;
  }
}

export async function getCourseProgress(
  userId: string,
  courseId: string
) {
  try {
    connectToData();

    const progresses = await Progress.find({
      userId,
      courseId: new mongoose.Types.ObjectId(courseId),
      completed: true
    }).lean() as unknown as IProgressDoc[];

    return progresses.map(progress => ({
      ...progress,
      _id: progress._id.toString(),
      courseId: progress.courseId.toString(),
      lessonId: progress.lessonId.toString()
    }));
  } catch (error) {
    console.error("Error getting course progress:", error);
    throw error;
  }
}

export async function calculateCourseCompletionRate(
  courseId: string,
  totalLessons: number
) {
  try {
    connectToData();

    const result = await Progress.aggregate([
      { 
        $match: { 
          courseId: new mongoose.Types.ObjectId(courseId),
          completed: true 
        }
      },
      {
        $group: {
          _id: "$userId",
          completedLessons: { $sum: 1 }
        }
      },
      {
        $project: {
          completionRate: {
            $multiply: [
              { $divide: ["$completedLessons", totalLessons] },
              100
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageCompletionRate: { $avg: "$completionRate" }
        }
      }
    ]);

    return result[0]?.averageCompletionRate || 0;
  } catch (error) {
    console.error("Error calculating course completion rate:", error);
    throw error;
  }
}

export async function updateVideoProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  watchTime: number,
  watchedPercent: number,
  lastPosition: number
) {
  try {
    connectToData();

    const progress = await Progress.findOneAndUpdate(
      { 
        userId,
        courseId: new mongoose.Types.ObjectId(courseId),
        lessonId: new mongoose.Types.ObjectId(lessonId)
      },
      {
        $set: {
          watchTime,
          watchedPercent,
          lastPosition,
          ...(watchedPercent >= 90 && {
            completed: true,
            completedAt: new Date()
          })
        }
      },
      { upsert: true, new: true }
    ).lean() as unknown as IProgressDoc;

    if (progress) {
      return {
        ...progress,
        _id: progress._id.toString(),
        courseId: progress.courseId.toString(),
        lessonId: progress.lessonId.toString()
      };
    }

    return null;
  } catch (error) {
    console.error("Error updating video progress:", error);
    throw error;
  }
} 