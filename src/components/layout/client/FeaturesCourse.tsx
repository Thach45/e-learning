"use client"
import { BookOpen, Clock, MonitorPlay, Trophy } from "lucide-react"

export default function FeaturesCourse() {
  const features = [
    {
      icon: <MonitorPlay className="w-6 h-6 text-blue-600" />,
      title: "Video chất lượng cao",
      description: "Học qua video HD với phụ đề rõ ràng"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Tài liệu chi tiết",
      description: "Tài liệu được cập nhật thường xuyên"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Học mọi lúc mọi nơi",
      description: "Truy cập và học tập không giới hạn"
    },
    {
      icon: <Trophy className="w-6 h-6 text-blue-600" />,
      title: "Chứng chỉ hoàn thành",
      description: "Nhận chứng chỉ sau khi hoàn thành"
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        Tính năng khóa học
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}