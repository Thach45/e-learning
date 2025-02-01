"use server";
import Course, { TCourse } from "@/database/course.model";
import Lecture, { TLecture } from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User, { TUser } from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCourse, TLesson, TShowCourse } from "@/types";



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

        const courses = await Course.find().lean<TCourseInfo[]>();

        // Sử dụng Promise.all để xử lý các truy vấn không đồng bộ
        await Promise.all(courses.map(async (course) => {
            const author = await User.findById(course.author);
            if (author) {
                course.author = author.name;
            }
        }));

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

        // Truy vấn khóa học dựa trên slug
        const course = await Course.findOne({ slug }).lean<TShowCourse>();

        if (!course) {
            return null;
        }

        // Truy vấn các bài giảng liên quan
        // Truy vấn các bài học liên quan trong mỗi bài giảng
        type TExtendedLecture = TLecture & {
            lessons: TLesson[];
            
          };
        const lectures = await Lecture.find({ _id: { $in: course.lectures } })
            .select('_id title lesson')
            .lean<TExtendedLecture[]>();

        for (const lecture of lectures) {
            const lessons = await Lesson.find({ _id: { $in: lecture.lesson } })
                
                .lean<TLesson[]>();
            lecture.lessons = lessons;
        }

        // Truy vấn các học sinh liên quan
        const students = await User.find({ _id: { $in: course.students } })
            .select('_id name')
            .lean<TUser[]>();

        // Truy vấn tác giả liên quan
        const author = await User.findById(course.author)
            .select('_id name email')
            .lean<TUser>();

        // Kết hợp dữ liệu vào đối tượng khóa học
        course.lectures = lectures;
        course.students = students;
        course.author = author;
console.log(course.lectures.map(lecture => lecture.lesson));
        return course;
    } 
    catch (error) {
        console.log("Error fetching course:", error);
        return null;
    }
}