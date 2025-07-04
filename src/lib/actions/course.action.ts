"use server";
import Category from "@/database/categogy.model";
import Comment from "@/database/comment.model";
import Course, { TCourse } from "@/database/course.model";
import Lecture, { TLecture } from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User, { TUser } from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCourse, TEditCourse, TLesson, TShowCourse, TShowComment } from "@/types";
import { Schema } from "mongoose";

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


export const getCourseCondition = async (
    title = "", 
    sort = "asc", 
    page = 1, 
    limit = 2
): Promise<{ courses: TCourseInfo[], totalPages: number } | undefined> => {
    try {
        await connectToData();
        
        // Build the query
        const query = title 
            ? { title: { $regex: title, $options: "i" } }
            : {};

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalCourses = await Course.countDocuments(query);
        const totalPages = Math.ceil(totalCourses / limit);

        // Get paginated courses
        const courses = await Course.find(query)
            .sort({ sale_price: sort as SortOrder })
            .skip(skip)
            .limit(limit)
            .lean<TCourseInfo[]>();

        // Fetch author names
        await Promise.all(courses.map(async (course) => {
            const author = await User.findById(course.author);
            if (author) {
                course.author = author.name;
            }
        }));

        // Serialize the courses
        const serializedCourses = courses.map(course => ({
            ...course,
            _id: course._id.toString(),
            category: course.category ? course.category.toString() : "",
            students: course.students ? course.students.map(student => student.toString()) : [],
        }));

        return {
            courses: serializedCourses,
            totalPages
        };
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

export const rateCourse = async (courseId: string, rating: number, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
        await connectToData();

        if (!courseId || !rating || rating < 1 || rating > 5 || !userId) {
            return {
                success: false,
                message: "Dữ liệu đánh giá không hợp lệ"
            };
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return {
                success: false,
                message: "Không tìm thấy khóa học"
            };
        }

        // Check if user is enrolled in the course
        if (!course.students.includes(userId)) {
            return {
                success: false,
                message: "Bạn cần tham gia khóa học để đánh giá"
            };
        }

        // Initialize ratings array if it doesn't exist
        if (!course.ratings) {
            course.ratings = [];
        }

        // Check if user has already rated
        const existingRating = course.ratings.find((r: { userId: Schema.Types.ObjectId }) => 
            r.userId.toString() === userId
        );
        
        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.created_at = new Date();
        } else {
            // Add new rating
            course.ratings.push({
                userId,
                rating,
                created_at: new Date()
            });
        }

        await course.save();

        return {
            success: true,
            message: existingRating ? "Cập nhật đánh giá thành công" : "Đánh giá thành công"
        };
    } catch (error) {
        console.error("Error in rating course:", error);
        return {
            success: false,
            message: "Có lỗi xảy ra khi đánh giá khóa học"
        };
    }
}