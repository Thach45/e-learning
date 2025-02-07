"use server"

import Category from "@/database/categogy.model";
import Course from "@/database/course.model";
import { connectToData } from "@/lib/mongoose";
import { TCourseInfo, TCreateCategory, TShowCategory, TShowCourse } from "@/types";

export const createCategory = async (category: TCreateCategory): Promise<TCreateCategory | null | undefined> => {
    try {
        await connectToData();
        const newCategory = await Category.create(category);
        await newCategory.save();
        return newCategory;
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}

export const getCategories = async (): Promise<TShowCategory[] |undefined| null> => {
    try {
        await connectToData();
        const categories = await Category.find().lean<TShowCategory[]>();

        const categoriesWithCourses  = await Promise.all(
            categories.map(async (category) => {
                const courseDetails = await Promise.all(
                    category.courses.map(async (courseId) => {
                        const res =  await Course.findById(courseId).select("title").lean<TShowCourse>();
                        return res;
                    })
                );

                return { ...category, courses: courseDetails.filter((course) => course !== null) };
            })
        );
        
        return categoriesWithCourses;
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
};


export const deleteCourseInCategory = async (categoryId: string, courseId: string): Promise<boolean> => {
    try {
        await connectToData();
        const category = await Category.findById(categoryId);
        const course = await Course.findById(courseId);
        if (!course) {
            return false;
        }
        course.category = "";
        await course.save();
        if (!category) {
            return false;
        }
        category.courses = category.courses.filter((course : TShowCourse) => course.toString() !== courseId);
        await category.save();
        return true;
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

export const addCourseToCategory = async (categoryId: string, courseId: string): Promise<boolean> => {
    try {
        await connectToData();
        const category = await Category.findById(categoryId);
        if (!category) {
            console.log("Category not found");
            return false;
        }
        const course = await Course.findById(courseId);
        if (!course) {
            console.log("Course not found");
            return false;
        }
        course.category = categoryId;
        await course.save();
        category.courses.push(courseId);
        await category.save();
        return true;
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

export const courseNotInCategory = async (): Promise<TCourseInfo[] | null | undefined> => {
    try {
        await connectToData();
        const courses = await Course.find({category: ""}).lean<TCourseInfo[]>();
        return courses;
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}