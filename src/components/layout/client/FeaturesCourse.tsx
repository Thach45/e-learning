import { Card } from '@/components/ui/card'
import { Clock, Trophy, Users } from 'lucide-react'
import React from 'react'

const FeaturesCourse = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tại sao chọn khóa học này?</h2>
          <p className="text-gray-600">Những gì bạn sẽ nhận được từ khóa học</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock  className="w-8 h-8" />,
              title: "Học theo tốc độ của bạn",
              description: "Truy cập không giới hạn và học mọi lúc mọi nơi",
            },
            {
              icon: <Trophy className="w-8 h-8" />,
              title: "Dự án thực tế",
              description: "Xây dựng portfolio với các dự án thực tế",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Hỗ trợ 1-1",
              description: "Được mentor hỗ trợ trực tiếp khi gặp khó khăn",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-white border border-gray-200 p-6">
              <div className="text-black mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
  )
}

export default FeaturesCourse