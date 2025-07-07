"use server";
import Category from "@/database/categogy.model";
import Comment, { TComment } from "@/database/comment.model";
import Course, { TCourse } from "@/database/course.model";
import Lecture, { TLecture } from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import User, { TUser } from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCourse, TEditCourse, TLesson, TShowCourse, TShowComment } from "@/types";
import mongoose, { Schema } from "mongoose";

type TCourseWithComments = TCourseInfo & {
  comments: TShowComment[];
};
import { SortOrder } from "mongoose";
import { getUser } from "./user.actions";



export const createCourse = async (course: TCreateCourse) => {
    try {
        await connectToData();
        // Convert string IDs to ObjectIds
        const courseData = {
            ...course,
            author: course.author ? new mongoose.Types.ObjectId(course.author) : undefined,
            category: course.category ? new mongoose.Types.ObjectId(course.category) : undefined
        };
        const newCourse = await Course.create(courseData);
        const savedCourse = await newCourse.save();
        
        // Convert to plain object and transform ObjectIds to strings
        const plainCourse = {
            ...savedCourse.toObject(),
            _id: savedCourse._id.toString(),
            author: savedCourse.author?.toString(),
            category: savedCourse.category?.toString(),
        };

        return { success: true, course: plainCourse };
    } catch (error) {
        console.log("Error creating course:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to create course' 
        };
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
        console.log("course", course)
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

export const getCoursesWithComments = async (expertId: string): Promise<TCourseWithComments[] | null> => {
    try {
        await connectToData();

        // Only get courses owned by the expert
        const courses = await Course.find({ author: expertId }).lean<TCourseInfo[]>();

        const coursesWithComments = await Promise.all(
            courses.map(async (course: any) => {
                const lessons = await Lesson.find({ course: course._id }).lean();
                const comments = await Comment.find({ 
                    lesson: { $in: lessons.map((lesson) => lesson._id) } 
                })
                .sort({ created_at: -1 })
                .lean<TComment[]>();

                // Get all user IDs from comments
                const userIds = [...new Set(comments.map(comment => comment.user))];
                const users = await User.find({ clerkId: { $in: userIds } }).lean();
                const userMap = Object.fromEntries(users.map(user => [user.clerkId, user.name]));

                // Add user names to comments and convert to plain objects
                const commentsWithNames: TShowComment[] = comments.map(comment => ({
                    _id: comment._id.toString(),
                    user: comment.user,
                    name: userMap[comment.user] || "Unknown",
                    content: comment.content,
                    lesson: comment.lesson.toString(),
                    course: course._id.toString(),
                    parent: comment.parent?.toString(),
                    replies: (comment.replies || []).map((reply: any) => ({
                        _id: typeof reply === 'object' ? reply.toString() : reply,
                        user: "",
                        name: "",
                        content: "",
                        lesson: comment.lesson.toString(),
                        course: course._id.toString(),
                        replies: [],
                        created_at: new Date()
                    })),
                    created_at: new Date(comment.created_at)
                }));

                // Convert course to TCourseWithComments format
                return {
                    _id: course._id.toString(),
                    title: course.title,
                    slug: course.slug,
                    thumbnail: course.thumbnail,
                    price: course.price,
                    sale_price: course.sale_price,
                    status: course.status,
                    author: course.author.toString(),
                    category: course.category?.toString() || "",
                    students: (course.students || []).map((id: any) => id.toString()),
                    views: course.views || 0,
                    rating: course.rating || [],
                    technology: course.technology || [],
                    level: course.level,
                    created_at: course.created_at,
                    comments: commentsWithNames
                };
            })
        );

        return coursesWithComments;
    } catch (error) {
        console.log("Error fetching courses with comments:", error);
        return null;
    }
};

export const deleteCommentInCourse = async (courseId: string, commentId: string): Promise<{ success: boolean; message: string }> => {
    try {
        await connectToData();
        
        // Tìm comment để lấy lesson ID
        const comment = await Comment.findById(commentId).lean<TComment>();
        if (!comment) {
            return {
                success: false,
                message: "Không tìm thấy bình luận"
            };
        }

        // Xóa comment khỏi lesson
        await Lesson.findByIdAndUpdate(
            comment.lesson,
            { $pull: { comments: commentId } }
        );

        // Xóa các replies của comment này (nếu có)
        if (comment.replies && comment.replies.length > 0) {
            await Comment.deleteMany({ 
                _id: { $in: comment.replies } 
            });
        }

        // Xóa comment khỏi cơ sở dữ liệu
        await Comment.findByIdAndDelete(commentId);

        // Nếu comment là reply, cập nhật parent comment
        if (comment.parent) {
            await Comment.findByIdAndUpdate(
                comment.parent,
                { $pull: { replies: commentId } }
            );
        }

        return {
            success: true,
            message: "Đã xóa bình luận thành công"
        };
    }
    catch (error) {
        console.log("Error deleting comment:", error);
        return {
            success: false,
            message: "Có lỗi xảy ra khi xóa bình luận"
        };
    }
};


export const updateCourse = async (id: string, course: TCreateCourse): Promise<TCourse | null> => {
    try {
        await connectToData();
        
        // Get the existing course first
        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            return null;
        }

        // Prepare the update data while preserving existing fields
        const updateData = {
            title: course.title,
            description: course.description,
            price: course.price,
            sale_price: course.sale_price,
            slug: course.slug,
            status: course.status || existingCourse.status,
            level: course.level,
            category: course.category,
            thumbnail: course.thumbnail || existingCourse.thumbnail,
            technology: course.technology || existingCourse.technology,
            info: {
                requirements: course.info?.requirements || existingCourse.info?.requirements || [],
                benefits: course.info?.benefits || existingCourse.info?.benefits || []
            },
            author: existingCourse.author // Preserve the original author
        };

        // Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return null;
        }

        // Convert to plain object and transform ObjectIds to strings
        const plainCourse = updatedCourse.toObject();
        return {
            ...plainCourse,
            _id: plainCourse._id.toString(),
            author: plainCourse.author?.toString(),
            category: plainCourse.category?.toString(),
            students: plainCourse.students?.map((id: mongoose.Types.ObjectId) => id.toString())
        };
    } catch (error) {
        console.error("Error updating course:", error);
        return null;
    }
};

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

export const getExpertCourses = async (expertId: string): Promise<TCourseInfo[] | undefined> => {
    try {
        await connectToData();
        const user = await getUser(expertId);
        if (!user) {
            return undefined;
        }
        const courses = await Course.find({ author: user._id }).lean<TCourseInfo[]>();

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
            category: course.category ? course.category.toString() : "",
            students: course.students ? course.students.map(student => student.toString()) : [],
        }));

        return serializedCourses;
    } catch (error) {
        console.log("Error fetching expert courses:", error);
        return undefined;
    }
};