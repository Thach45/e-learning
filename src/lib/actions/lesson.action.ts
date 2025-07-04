"use server"

import { Types } from 'mongoose';
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateLesson, TEditLesson, TLesson, TShowLesson } from "@/types";

export const createLesson = async (lesson: TCreateLesson) => {
    try {
        await connectToData();

        // Validate ObjectIds
        if (!Types.ObjectId.isValid(lesson.course) || !Types.ObjectId.isValid(lesson.lecture)) {
            throw new Error('Invalid course or lecture ID');
        }

        // Find max order for the specific lecture
        const maxOrderLesson = await Lesson.findOne({ 
            lecture: lesson.lecture,
            course: lesson.course 
        }).sort('-order').exec();

        const newOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;

        const newData = { 
            ...lesson,
            order: newOrder,
            attachments: lesson.attachments || [],
            course: new Types.ObjectId(lesson.course),
            lecture: new Types.ObjectId(lesson.lecture)
        };
       
        console.log("Creating lesson with data:", newData);
        const les = await Lesson.create(newData);
        console.log("Created lesson:", les);

        await Lecture.findByIdAndUpdate(
            lesson.lecture, 
            { $push: { lessons: les._id } }
        ).exec();
        
        return les;
    }
    catch (error) {
        console.log("Error creating lesson:", error);
        throw error;
    }
}

export const getLessons = async (idLecture: string, idCourse: string): Promise<TLesson[]| undefined> => {
    try {
        await connectToData();

        // Validate ObjectIds
        if (!Types.ObjectId.isValid(idLecture) || !Types.ObjectId.isValid(idCourse)) {
            throw new Error('Invalid lecture or course ID');
        }

        const lessons = await Lesson.find({
            lecture: new Types.ObjectId(idLecture), 
            course: new Types.ObjectId(idCourse)
        }).lean<TLesson[]>().exec();

        const cleanedLessons = lessons.map(lesson => ({
            ...lesson,
            _id: lesson._id!.toString(),
            course: lesson.course.toString(),
            lecture: lesson.lecture.toString(),
            attachments: lesson.attachments || []
        }));
        console.log("cleanedLessons", cleanedLessons);
        return cleanedLessons;
    }
    catch (error) {
        console.log("Error getting lessons:", error);
        throw error;
    }
}

export const deleteLesson = async (id: string): Promise<void> => {
    try {
        await connectToData();
        await Lesson.findByIdAndDelete(id).exec();
    }
    catch (error) {
        console.log("lỗi nè", error);
        throw error;
    }
}

export const updateLesson = async (id: string, lesson: TEditLesson): Promise<void> => {
    try {
        await connectToData();
        const updateData = {
            ...lesson,
            attachments: lesson.attachments || []
        };
        console.log("Updating lesson with data:", updateData);
        const result = await Lesson.findByIdAndUpdate(id, updateData, { new: true }).exec();
        console.log("Update result:", result);
    }
    catch (error) {
        console.log("lỗi nè", error);
        throw error;
    }
}

export const getLessonBySlug = async (slug: string): Promise<TShowLesson | null | undefined> => {
    try {
        await connectToData();
        const lesson = await Lesson.findOne({ slug }).lean<TShowLesson>();
        if (lesson) {
            return {
                ...lesson,
                attachments: lesson.attachments || []
            };
        }
        return null;
    }
    catch (error) {
        console.log("lỗi nè", error);
        throw error;
    }
}