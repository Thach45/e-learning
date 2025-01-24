"use server";
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

export const getUser= async (userId : string): Promise<TUser | null | undefined> => {
    try {
        connectToData();
        
        const info = await User.findOne({ clerkId: userId });
      
        return info;
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
