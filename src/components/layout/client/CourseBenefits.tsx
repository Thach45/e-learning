"use client"
import { CheckCircle2 } from "lucide-react"
import { TShowCourse } from "@/types"

interface CourseBenefitsProps {
  courseInfo: TShowCourse | null;
}

export default function CourseBenefits({ courseInfo }: CourseBenefitsProps) {
  if (!courseInfo?.info.benefits.length) return null;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-950 dark:text-blue-100">
          Bạn sẽ học được gì?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {courseInfo.info.benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 bg-white dark:bg-blue-900/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-blue-100 dark:border-blue-800"
            >
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-blue-900 dark:text-blue-100">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 