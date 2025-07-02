"use client"
import { TShowCourse } from "@/types"
import { ListLesson } from "./ListLesson"

interface CourseCurriculumProps {
  courseInfo: TShowCourse | null;
}

export default function CourseCurriculum({ courseInfo }: CourseCurriculumProps) {
  if (!courseInfo?.lectures.length) return null;

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-950 dark:text-blue-100">
          Nội dung khóa học
        </h2>
        <div className="bg-white dark:bg-blue-900/30 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-blue-800">
          <ListLesson courseInfo={courseInfo} />
        </div>
      </div>
    </div>
  )
} 