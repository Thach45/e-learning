"use server";
import Comment from "@/database/comment.model";
import Lesson from "@/database/lesson.model";
import User from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateComment, TShowComment } from "@/types";
import mongoose from "mongoose";

export const createComment = async (comment: TCreateComment): Promise<TCreateComment | null | undefined> => {
    try {
        await connectToData();
        const newComment = await Comment.create(comment);
        await newComment.save();
        await Comment.findByIdAndUpdate(comment.parent, { $push: { replies: newComment._id } });
        const id = new mongoose.Types.ObjectId(comment.lesson);
        await Lesson.findByIdAndUpdate(id, { $push: { comment: newComment._id } });
        return newComment;
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
};


export const getCommentsByLessonId = async (lessonId: string): Promise<TShowComment[] | null> => {
    try {
        await connectToData();
        // Lấy tất cả comments của lesson này, bao gồm cả replies
        const allComments = await Comment.find({ lesson: lessonId }).lean<TShowComment[]>();
        
        // Lấy tất cả userIds từ tất cả comments
        const userIds = [...new Set(allComments.map(comment => comment.user))];
        const users = await User.find({ clerkId: { $in: userIds } }).lean();
        const userMap = Object.fromEntries(users.map(user => [user.clerkId, user.name]));

        // Tạo map để lưu trữ comments theo _id để dễ truy cập
        const commentMap = new Map(allComments.map(comment => [comment._id.toString(), {
            ...comment,
            name: userMap[comment.user] || "Unknown",
            replies: []
        }]));

        // Phân loại comments thành root comments và replies
        const rootComments: TShowComment[] = [];
        
        // Duyệt qua tất cả comments để xây dựng cấu trúc cây
        allComments.forEach(comment => {
            const commentWithName = commentMap.get(comment._id.toString())!;
            
            if (!comment.parent) {
                // Nếu là comment gốc, thêm vào mảng rootComments
                rootComments.push(commentWithName);
            } else {
                // Nếu là reply, thêm vào replies của parent comment
                const parentComment: TShowComment | undefined = commentMap.get(comment.parent.toString());
                if (parentComment) {
                    parentComment.replies.push(commentWithName);
                }
            }
        });
       
        return rootComments;

    } catch (error) {
        console.log("Error:", error);
        return null;
    }
};

export const getAllComments = async (): Promise<TShowComment[] | null> => {
    try {
        await connectToData();
        const allComments = await Comment.find().lean<TShowComment[]>();
        return allComments;
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
};