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
    category?: Schema.Types.ObjectId,
    technology: string[],
    info?: {
      requirements: string[],
      
      benefits: string[]
    },

}

export const ILinkItem