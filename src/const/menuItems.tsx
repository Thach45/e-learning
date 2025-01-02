import { TLinkItem } from '@/types';
import {
    BookOpen,
    GraduationCap,
    Home,
    LayoutDashboard,
    MessageSquare,
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
        icon: <LayoutDashboard className="h-5 w-5" />,
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
    }

]

export default menuItem;