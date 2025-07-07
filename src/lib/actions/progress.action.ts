"use server";

import mongoose from 'mongoose';
import { connectToData } from "@/lib/mongoose";
import Progress from "@/database/progress.model";
import Course from "@/database/course.model";

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

interface CourseStats {
  courseId: string;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  totalStudyTime: number;
  lastStudyDate: Date;
  watchTime?: number;
  watchedPercent?: number;
  completed?: boolean;
}

interface OverallStats {
  totalTime: number;
  totalCourses: number;
  completedLessons: number;
  totalLessons: number;
  lastStudyDate: Date;
}

interface CourseDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  lessons?: any[];
}

export async function getUserCourseStatistics(userId: string): Promise<CourseStats[]> {
  try {
    connectToData();

    // Lấy tất cả tiến độ của user
    const progresses = await Progress.find({ userId }).lean() as unknown as IProgressDoc[];

    // Nhóm theo khóa học
    const courseStats = new Map<string, CourseStats>();

    for (const progress of progresses) {
      const courseId = progress.courseId.toString();
      
      if (!courseStats.has(courseId)) {
        const course = await Course.findById(courseId).lean() as unknown as CourseDocument;
        courseStats.set(courseId, {
          courseId,
          courseName: course?.title || 'Unknown Course',
          totalLessons: course?.lessons?.length || 0,
          completedLessons: 0,
          totalStudyTime: 0,
          lastStudyDate: progress.updatedAt,
          watchTime: 0,
          watchedPercent: 0,
          completed: false
        });
      }

      const stats = courseStats.get(courseId)!;

      // Cập nhật thống kê
      if (progress.completed) {
        stats.completedLessons++;
        stats.completed = true;
      }
      stats.totalStudyTime += progress.watchTime || 0;
      stats.watchTime = (stats.watchTime || 0) + (progress.watchTime || 0);
      stats.watchedPercent = (stats.watchedPercent || 0) + (progress.watchedPercent || 0);
      
      if (progress.updatedAt > stats.lastStudyDate) {
        stats.lastStudyDate = progress.updatedAt;
      }
    }

    return Array.from(courseStats.values());
  } catch (error) {
    console.error("Error getting user course statistics:", error);
    throw error;
  }
}

export async function getUserOverallStatistics(userId: string): Promise<OverallStats> {
  try {
    connectToData();

    const courseStats = await getUserCourseStatistics(userId);
    
    return courseStats.reduce((acc, course) => ({
      totalTime: acc.totalTime + course.totalStudyTime,
      totalCourses: acc.totalCourses + 1,
      completedLessons: acc.completedLessons + course.completedLessons,
      totalLessons: acc.totalLessons + course.totalLessons,
      lastStudyDate: acc.lastStudyDate > course.lastStudyDate 
        ? acc.lastStudyDate 
        : course.lastStudyDate
    }), {
      totalTime: 0,
      totalCourses: 0,
      completedLessons: 0,
      totalLessons: 0,
      lastStudyDate: new Date(0)
    });
  } catch (error) {
    console.error("Error getting user overall statistics:", error);
    throw error;
  }
} 

export async function getLessonCompletionStats(courseId: string, lessonId: string) {
  try {
    connectToData();

    const result = await Progress.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
          lessonId: new mongoose.Types.ObjectId(lessonId)
        }
      },
      {
        $group: {
          _id: null,
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$completed", true] }, 1, 0]
            }
          },
          avgWatchTime: { $avg: "$watchTime" }
        }
      }
    ]);

    return {
      completedCount: result[0]?.completedCount || 0,
      avgWatchTime: Math.round(result[0]?.avgWatchTime || 0)
    };
  } catch (error) {
    console.error("Error getting lesson completion stats:", error);
    throw error;
  }
} 