
import User from "@/database/user.model";
import { connectToData } from "@/lib/mongoose";
import { TCreateUser } from "@/types";

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