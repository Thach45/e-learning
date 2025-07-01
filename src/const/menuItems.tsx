import { TLinkItem } from '@/types';
import {
    BookOpen,
    Home,
    LayoutDashboard,
    Users,
    ShoppingCart,
    MessageCircle,
    List,
  } from 'lucide-react';

const menuItem:TLinkItem[] = [
    {
        link: "/",
        icon: <Home className="h-5 w-5" />,
        title: "Trang chủ"
    },
    {
        link: "/courses",
        icon: <BookOpen className="h-5 w-5" />,
        title: "Khóa học"
    },
    {
        link: "/categories",
        icon: <List className="h-5 w-5" />,
        title: "Danh mục"
    },
    // {
    //     link: "/quizzes",
    //     icon: <GraduationCap className="h-5 w-5" />,
    //     title: "Quizzes"
    // },
    // {
    //     link: "/messages",
    //     icon: <MessageSquare className="h-5 w-5" />,
    //     title: "Messages"
    // }
    
]

const menuItemAdmin:TLinkItem[] = [
    {
        link: "/admin/manage/courses",
        icon: <LayoutDashboard className="h-5 w-5" />,
        title: "Manage Courses"
    },
    {
        link: "/admin/manage/categogy",
        icon: <Users className="h-5 w-5" />,
        title: "Manage Categories"
    },
    {
        link: "admin/manage/orders",
        icon: <ShoppingCart className="h-5 w-5" />,
        title: "Manage Orders"
    },
    {
        link: "admin/manage/comment",
        icon: <MessageCircle className="h-5 w-5" />,
        title: "Manage Comments"
    },
]

export { menuItem, menuItemAdmin }