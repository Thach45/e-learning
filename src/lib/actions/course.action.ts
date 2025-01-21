"use server";
import Course, { TCourse } from "@/database/course.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateCourse } from "@/types";


export const createCourse = async (course: TCreateCourse):Promise<TCourse | null | undefined> => {
    try {
        await connectToData();
        const newCourse = await Course.create(course);
        console.log('New course created:', course);
        return await newCourse.save();
    } catch (error) {
        console.log("lỗi nè",error);
    }

};
