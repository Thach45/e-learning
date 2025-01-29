import type React from "react"

interface VideoPlayerProps {
  videoUrl: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="w-full aspect-video">
      <video className="w-full h-full" controls src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer

