"use server";
import Course, { TCourse } from "@/database/course.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCourse } from "@/types";


export const createCourse = async (course: TCreateCourse):Promise<TCourse | null | undefined> => {
    try {
        await connectToData();
        const newCourse = await Course.create(course);
    
        return await newCourse.save();
    } catch (error) {
        console.log("lỗi nè",error);
    }

};

export const getCourses = async (): Promise<TCourseInfo[] | undefined> => {
    try {
        
        await connectToData();

        const courses = await Course.find()
            .populate('author', 'name email -_id') // Chỉ lấy các trường cần thiết
            
           
            .lean<TCourseInfo[]>(); // Trả về đối tượng thuần

        
        const serializedCourses = courses.map(course => ({
            ...course,
            _id: course._id.toString(),
            category: course.category.toString(),
            students: course.students.map(student => student.toString()),
        }));
        
        return serializedCourses;
    } catch (error) {
        console.log("Error fetching courses:", error);
        return undefined;
    }
};