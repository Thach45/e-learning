import { ECourseLevel } from "@/types/enums";

type TLinkItem = {
    link: string,
    icon: React.ReactNode,
    title: string
}

type TCreateUser = {
    clerkId: string,
    username: string,
    name?: string,
    email: string,
    avatar?: string,
    
}

type TUserInfo = {
    _id: string,
    name: string,
    email: string,
    role: string
}

type TCreateCourse = {
    title: string,
    
    thumbnail?: string,
    intro?: string,
    description?: string,
    price: number,
    sale_price: number | undefined,
    slug: string,
    status?: ECourseStatus,
    author?: Schema.Types.ObjectId,
    level: ECourseLevel,
    category?: string,
    technology: string[],
    info?: {
      requirements: string[],
      
      benefits: string[]
    },

}
type TEditCourse = {
    title: string,
    slug: string,
    thumbnail?: string,
    intro?: string,
    description?: string,
    price: number,
    sale_price: number | undefined,
    status?: ECourseStatus,
    author?: Schema.Types.ObjectId,
    level: ECourseLevel,
    category?: string,
    technology: string[],
    info?: {
      requirements: string[],
      
      benefits: string[]
    },
    students?: string[]
 

}
interface TCourseInfo {
    _id: string
    title: string
    slug: string
    thumbnail: string
    price: number
    sale_price: number
    status: ECourseStatus
    author: string,
    category: string,
    chapters?: Chapter[]
    students: Schema.Types.ObjectId[]
    views?: number
    rating?: number[]
    technology: string[]
    level: ECourseLevel
    created_at: Date

  }

type TCreateLecture = {
    _id?: string,
    title: string,
    course: Schema.Types.ObjectId,
    order?: number,
    deleted: boolean
}
type TCreateLesson = {
    title: string,
    slug: string,
    course: Schema.Types.ObjectId,
    lecture: Schema.Types.ObjectId,
    order: number,
    deleted: boolean
}
type TLesson = {
    _id: string,
    title: string,
    slug: string,
    videoType: EVideoType,
    videoURL: string,
    content: string,
    type: ELessonType,
    
    order: number,
    course: Schema.Types.ObjectId,
    lecture: Schema.Types.ObjectId,
    
}
type TEditLesson = {
    _id: string,
    title: string,
    slug: string,
    order: number,
    videoType: EVideoType,
    videoURL: string,
    content: string,
    type: ELessonType,
    deleted: boolean
}
type TShowLesson = {
    _id: string,
    title: string,
    slug: string,
    order: number,
    videoType: EVideoType,
    videoURL: string,
    content: string,
    
    type: ELessonType,
    attachments: [
        {
            title: string,
            url: string
        }
    ],

    description: string,
    comments: Schema.Types.ObjectId[],
    course: Schema.Types.ObjectId,
    lecture: Schema.Types.ObjectId,
    deleted: boolean
}

type TShowCourse = {
    
    _id: string,
    info: {
        requirements: string[],
        benefits: string[]
    },
    author: Schema.Types.ObjectId,
    thumbnail: string,
    title: string,
    description: string,
    rating: number[],
    sale_price: number,
    students: Schema.Types.ObjectId[],
    lectures: Schema.Types.ObjectId[],
    technology: string[],
    level: ECourseLevel,
    category: Schema.Types.ObjectId,
}

type TShowLecture = {
    _id: string,
    title: string,
    course: Schema.Types.ObjectId,
    lessons: Schema.Types.ObjectId[],
    
}
type TCreateComment = {
    parent?: string;
    user: string;
    content: string;
    lesson: string
    replies?: TShowComment[]
}
type TShowComment = {
    _id: string;
    user: string;
    parent?: string;
    replies: TShowComment[];
    name: string;
    content: string;
    lesson: string;
    created_at: Date;
}
type TCreateCategory = {
    title: string;
    deleted: boolean;
}
type TShowCategory = {
    _id: string;
    title: string;
    courses: TShowCourse[];
    nameCourses: string[];
    deleted: boolean;
}

type TAddStudent = {
    
}

export const ILinkItem