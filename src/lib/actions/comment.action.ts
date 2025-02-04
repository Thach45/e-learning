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
       
        const id = new mongoose.Types.ObjectId(comment.lesson);
        await Lesson.findByIdAndUpdate(id, { $push: { comment: newComment._id } });
        return newComment;
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
};


export const getCommentsByLessonId = async (lessonId: string): Promise<TShowComment[] | null | undefined> => {
    try {
        await connectToData();
        const comments = await Comment.find({ lesson: lessonId });
        
    
        const updatedComments = await Promise.all(
            comments.map(async (comment: TShowComment) => {
                const user = await User.findOne({ clerkId: comment.user });
                return {
                    ...comment.toObject(),
                    name: user ? user.name : "Unknown",
                };
            })
        );
       
        return updatedComments; 
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}