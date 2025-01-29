"use client";

import LessonViewer from "@/components/layout/client/LessonPlayer";
import CourseSidebar from "@/components/layout/client/SidebarVideo";
import { useParams } from "next/navigation";



export default function Home() {
  const params = useParams();
  
  return (
    <div className="flex h-screen bg-gray-100">
      <CourseSidebar courseSlug={params.slugcourse as string} />
      <main className="flex-1 overflow-y-auto p-4">
        <LessonViewer />
      </main>
    </div>
  )
}