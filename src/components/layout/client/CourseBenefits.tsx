"use client"
import { CheckCircle2 } from "lucide-react"
import { TShowCourse } from "@/types"

interface CourseBenefitsProps {
  courseInfo: TShowCourse | null;
}

export default function CourseBenefits({ courseInfo }: CourseBenefitsProps) {
  if (!courseInfo?.info.benefits.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        Bạn sẽ học được gì?
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {courseInfo.info.benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-200">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 