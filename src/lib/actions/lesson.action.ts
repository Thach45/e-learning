"use server"

import Lesson from "@/database/lesson.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateLesson, TEditLesson, TLesson } from "@/types";

export const createLesson = async (lesson: TCreateLesson) => {
    try {
        await connectToData();
        const maxOrderLesson = await Lesson.findOne({ chapter: lesson }).sort('-order').exec();
        const newOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;
        const newData = { ...lesson, 
            
            // videoURL: lesson.videoURL || '',
            // content: lesson.content || '',
            order: newOrder };
       
        console.log("newData", newData);
        await Lesson.create(newData);
        
    }
    catch (error) {
        console.log("lỗi nè", error);
    }
}


export const getLessons = async (idLecture: string, idCourse: string): Promise <TLesson[]| undefined> => {
    try {
        await connectToData();
        const lessons = await Lesson.find({lecture: idLecture,course: idCourse }).lean<TLesson[]>().exec();
        const cleanedLessons = lessons.map(lesson => ({
            ...lesson,
            _id: lesson._id!.toString(),
            course: lesson.course.toString(),
            lecture: lesson.lecture.toString(),
        }));
        console.log("cleanedLessons", cleanedLessons);
        return cleanedLessons;
    }
    catch (error) {
        console.log("lỗi nè", error);
    }
}


export const deleteLesson = async (id: string): Promise<void> => {
    try {
        await connectToData();
        await Lesson.findByIdAndDelete(id).exec();
    }
    catch (error) {
        console.log("lỗi nè", error);
    }
}

export const updateLesson = async (id: string, lesson: TEditLesson): Promise<void> => {
    try {
        await connectToData();
        await Lesson.findByIdAndUpdate(id, lesson).exec();
    }
    catch (error) {
        console.log("lỗi nè", error);
    }
}