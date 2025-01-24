"use server"

import Lecture from "@/database/lecture.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateLecture } from "@/types";

export const createLecture = async (lecture: TCreateLecture): Promise<void> => {
    try {
        await connectToData();
        const maxOrderLecture = await Lecture.findOne({ course: lecture.course }).sort('-order').exec();
        const newOrder = maxOrderLecture ? maxOrderLecture.order + 1 : 1;
        const newData = { ...lecture, order: newOrder };
        await Lecture.create(newData);
        
    }
    catch (error) {
        console.log("lỗi nè", error);
    }

}

export const getLectures = async (idCourse: string): Promise <TCreateLecture[]| undefined> => {
    try {
        await connectToData();
        console.log("idCourse", idCourse);
        const lectures = await Lecture.find({course: idCourse}).lean<TCreateLecture[]>().exec();
        const cleanedLectures = lectures.map(lecture => ({
            ...lecture,
            _id: lecture._id!.toString(),
            course: lecture.course.toString(),
        }));
        return cleanedLectures;
    }
    catch (error) {
        console.log("lỗi nè", error);
    }

}


export const deleteLecture = async (id: string): Promise<void> => {
    try {
        await connectToData();
        await Lecture.findByIdAndDelete(id).exec();
    }
    catch (error) {
        console.log("lỗi nè", error);
    }
}