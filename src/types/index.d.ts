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
    slug: string,
    thumbnail?: string,
    intro?: string,
    description?: string,
    price: number,
    sale_price: number | undefined,
    slug: string,
    status?: ECourseStatus,
    author?: Schema.Types.ObjectId,
    level: ECourseLevel,
    category?: Schema.Types.ObjectId,
    technology: string[],
    info?: {
      requirements: string[],
      
      benefits: string[]
    },

}

interface TCourseInfo {
    _id: string
    title: string
    slug: string
    thumbnail: string
    price: number
    sale_price: number
    status: ECourseStatus
    author: {
      _id: string
      name: string
    }
    category: Schema.Types.ObjectId,
    chapters?: Chapter[]
    students: Schema.Types.ObjectId[]
    views?: number
    rating?: number[]
    technology: string[]
    level: ECourseLevel

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
    students: Schema.Types.ObjectId[],
    lectures: Schema.Types.ObjectId[],
}

type TShowLecture = {
    _id: string,
    title: string,
    course: Schema.Types.ObjectId,
    lessons: Schema.Types.ObjectId[],
    
}

export const ILinkItem