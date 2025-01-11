import { TLinkItem } from '@/types';
import {
    BookOpen,
    GraduationCap,
    Home,
    LayoutDashboard,
    MessageSquare,
    ClipboardList,
    Users,
    ShoppingCart,
    MessageCircle,
  } from 'lucide-react';

const menuItem:TLinkItem[] = [
    {
        link: "/",
        icon: <Home className="h-5 w-5" />,
        title: "Home"
    },
    {
        link: "/courses",
        icon: <BookOpen className="h-5 w-5" />,
        title: "Courses"
    },
    {
        link: "/assignments",
        icon: <ClipboardList className="h-5 w-5" />,
        title: "Assignments"
    },
    {
        link: "/quizzes",
        icon: <GraduationCap className="h-5 w-5" />,
        title: "Quizzes"
    },
    {
        link: "/messages",
        icon: <MessageSquare className="h-5 w-5" />,
        title: "Messages"
    },
    {
        link: "admin/manage/courses",
        icon: <LayoutDashboard className="h-5 w-5" />,
        title: "Manage Courses"
    },
    {
        link: "admin/manage/students",
        icon: <Users className="h-5 w-5" />,
        title: "Manage Students"
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

export default menuItem;