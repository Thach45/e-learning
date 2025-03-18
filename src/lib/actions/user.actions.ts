"use server";
import Course from "@/database/course.model";
import User, { TUser } from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateUser, TUserInfo } from "@/types";


export const createUser = async (user: TCreateUser) => {
    try {
        connectToData();
        const newUser = await User.create(user);
        console.log('New user created:', newUser);
        return await newUser.save();
    } catch (error) {
        console.log(error);
    }

};

export const getUser= async (userId : string): Promise<TUserInfo | null | undefined> => {
    try {
        connectToData();
        
        const info = await User.findOne({ clerkId: userId }).select('-clerkId').lean<TUserInfo>().exec();
        
        return info 
    } catch (error) {
        console.log("Error getting user info", error);
    }
}

export const getUserRole = async (role: string):Promise<TUserInfo[] |  undefined> => {
 
    try {
        connectToData();
        const info = await User.find({ role: role }).select('_id name email role').exec();
        return info;
    }
    catch (error) {
        console.log("Error getting user role", error);
    }
}

export const getAuthor = async (authorId: string): Promise<TUserInfo | null | undefined> => {
    try {
        connectToData();
        const author = await User.findOne({ _id: authorId }).select('_id name email role').exec();
        return author;
    } catch (error) {
        console.log("Error getting author", error);
    }
}

export const getFullUser = async (): Promise<TUser[] | null | undefined> => {
    try {
        connectToData();
        const user = await User.find().exec();
        return user;
    } catch (error) {
        console.log("Error getting full user", error);
    }
}

export const getUserByManyId = async (ids: string[]): Promise<TUserInfo[] | null | undefined> => {
    try {
        connectToData();
        const users = await User.find({ _id: { $in: ids } }).select('_id name email').exec();
        return users;
    } catch (error) {
        console.log("Error getting user by many id", error);
    }
}

export const addCourseToUser = async (courseId: string, userIds: string[]) => {
    try {
        connectToData();
        await User.updateMany(
            { _id: { $in: userIds } },
            { $push: { courses: courseId } }
        ).exec();
        await Course.updateOne(
            { _id: courseId },
            { $push: { students: userIds } }
        ).exec();

    } catch (error) {
        console.log("Error adding users in course", error);
    }
}

export const removeCourseFromUser = async (courseId: string, userIds: string[]) => {
    try {
        connectToData();
        await User.updateMany(
            { _id: { $in: userIds } },
            { $pull: { courses: courseId } }
        ).exec();
        console.log("step1")
        await Course.updateOne(
            { _id: courseId },
            { $pull: { students: { $in: userIds } } }
        ).exec();
        console.log("step2")
    } catch (error) {
        console.log("Error removing users from course", error);
    }
}
