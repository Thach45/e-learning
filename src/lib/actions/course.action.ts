"use server";
import Category from "@/database/categogy.model";
import Comment from "@/database/comment.model";
import Course, { TCourse } from "@/database/course.model";
import Lecture, { TLecture } from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User, { TUser } from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCourse, TEditCourse, TLesson, TShowCourse, TShowComment } from "@/types";

type TCourseWithComments = TCourseInfo & {
  comments: TShowComment[];
};
import { SortOrder } from "mongoose";



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
            category:course.category ? course.category.toString() : "",
            students:course.students ? course.students.map(student => student.toString()) : [],
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


export const getCourseCondition = async (title = "", sort = "asc"): Promise<TCourseInfo[] | undefined> => {
    try {
       await connectToData();
       let courses: TCourseInfo[] = [];
       if (title) {
            courses = await Course.find({ title: { $regex: title, $options: "i" } }).sort({sale_price: sort as SortOrder}).lean<TCourseInfo[]>();
        }
        else {
            courses = await Course.find().sort({sale_price: sort as SortOrder}).lean<TCourseInfo[]>();
        }
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
            category:course.category ? course.category.toString() : "",
            students:course.students ? course.students.map(student => student.toString()) : [],
        }));



        return serializedCourses;
    } catch (error) {
        console.log("Error fetching courses:", error);
        return undefined;
    }
};

export const getCourseById = async (id: string): Promise<TEditCourse | null> => {
    try {
        await connectToData();

        const course = await Course.findById(id).lean<TEditCourse>();
        const authorName = await User.findById(course?.author).select('name').lean<TUser>();
        const categoryName = await Category.findById(id).select('title').lean<TCourse>();
        if (course) {
            course.author = authorName?.name || "";
            course.category = categoryName?.title || "";
        }
        
        return course;
    } catch (error) {
        console.log("Error fetching course:", error);
        return null;
    }
}

export const getCoursesWithComments = async (): Promise<TCourseWithComments[] | null> => {
    try {
        await connectToData();

        const courses = await Course.find().lean<TCourseInfo[]>();

        const coursesWithComments = await Promise.all(
            courses.map(async (course) => {
                const lessons = await Lesson.find({ course: course._id }).lean();
                const comments = await Comment.find({ lesson: { $in: lessons.map((lesson) => lesson._id) } }).lean<TShowComment[]>();

                return {
                    ...course,
                    comments,
                };
            })
        );

        return coursesWithComments;
    } catch (error) {
        console.log("Error fetching courses with comments:", error);
        return null;
    }
};

export const deleteCommentInCourse = async (courseId: string, commentId: string): Promise<TShowComment | null> => {
    try {
        await connectToData();
        const course = await Course.findById(courseId);
        if (!course) {
            return null;
        }

        // Xóa comment khỏi khóa học
        await Course.findByIdAndUpdate(
            courseId,
            { $pull: { comments: commentId } },
            { new: true }
        );

        // Xóa comment khỏi cơ sở dữ liệu
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        return deletedComment;
    }
    catch (error) {
        console.log("Error deleting comment:", error);
        return null;
    }
}


export const updateCourse = async (id: string, course: TCreateCourse): Promise<TCourse | null> => {
    try {
        await connectToData();
        const updatedCourse = await Course.findByIdAndUpdate(id, course, { new: true });
        return updatedCourse;
    } catch (error) {
        console.log("Error updating course:", error);
        return null;
    }
}