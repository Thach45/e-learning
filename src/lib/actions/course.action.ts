"use server";
import Course, { TCourse } from "@/database/course.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCourse, TShowCourse } from "@/types";


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
            .populate([
                {
                    path: "lectures",
                    populate: {
                        path: "lesson",     
                    }
                },
                {
                    path: "students",
                    select: "_id name"
                },
                {
                    path: "author",
                    select: "_id name email "
                }
            ])
            .lean<TCourseInfo[]>();

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

export const getCourseBySlug = async (slug: string): Promise<TShowCourse | null> => {
    try {
        await connectToData();

        const course = await Course.findOne({ slug })
            
            .populate([
                {
                    path: "lectures",
                    select: "_id title lesson",
                    populate: {
                        path: "lesson",
                        
                    }
                },
                {
                    path: "students",
                    select: "_id name"
                },
                {
                    path: "author",
                    select: "_id name email "
                }
            ])
            .lean<TShowCourse>();

        return course || null;
    } catch (error) {
        console.error("Error fetching course by slug:", error);
        return null;
    }
};
