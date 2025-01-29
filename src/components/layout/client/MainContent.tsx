import VideoPlayer from "@/components/layout/client/VideoPlayer"
import type React from "react"

interface MainContentProps {
  videoUrl: string
  lessonContent: string
}

const MainContent: React.FC<MainContentProps> = ({ videoUrl, lessonContent }) => {
  return (
    <div className="flex-1 p-6">
      <VideoPlayer videoUrl={videoUrl} />
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Nội dung bài học</h2>
        <div dangerouslySetInnerHTML={{ __html: lessonContent }} />
      </div>
    </div>
  )
}

export default MainContent

