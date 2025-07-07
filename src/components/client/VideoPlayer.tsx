'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { markLessonAsCompleted, getLessonProgress, updateVideoProgress } from "@/lib/actions/progress.action";

interface VideoPlayerProps {
  videoType: "DRIVE" | "YOUTUBE" | "HOSTED";
  videoURL: string;
  courseId: string;
  lessonId: string;
  userId?: string;
}

export default function VideoPlayer({
  videoType,
  videoURL,
  courseId,
  lessonId,
  userId
}: VideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [studyTime, setStudyTime] = useState(0);

  // Khởi tạo startTime khi component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer độc lập để cập nhật thời gian học
  useEffect(() => {
    if (!mounted) return;

    const startTime = new Date();
    const timer = setInterval(() => {
      const currentTime = new Date();
      const timeSpent = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
      setStudyTime(timeSpent);
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    const checkProgress = async () => {
      if (!userId) return;
      
      try {
        const progress = await getLessonProgress(userId, courseId, lessonId);
        setIsCompleted(progress?.completed || false);
      } catch (error) {
        console.error("Error checking progress:", error);
      }
    };

    if (userId) {
      checkProgress();
    }
  }, [userId, courseId, lessonId]);

  const handleMarkAsCompleted = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      // Cập nhật tiến độ với thời gian học
      await updateVideoProgress(
        userId,
        courseId,
        lessonId,
        studyTime, // thời gian học (giây)
        100, // watchedPercent
        0 // lastPosition
      );

      // Đánh dấu hoàn thành
      await markLessonAsCompleted(userId, courseId, lessonId, true);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error marking as completed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStudyTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const renderVideo = () => {
    switch (videoType) {
      case "DRIVE":
        return (
          <iframe
            src={`https://drive.google.com/file/d/${videoURL}/preview`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        );
      case "YOUTUBE":
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoURL}?rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        );
      case "HOSTED":
        return (
          <video
            src={videoURL}
            controls
            className="w-full h-full"
          />
        );
      default:
        return <div>Unsupported video type</div>;
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-black">
          {renderVideo()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black">
        {renderVideo()}
      </div>
      
      {userId && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Thời gian học: {formatStudyTime(studyTime)}
          </div>
          <Button
            onClick={handleMarkAsCompleted}
            disabled={isCompleted || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isCompleted ? "Đã hoàn thành" : "Đánh dấu đã học xong"}
          </Button>
        </div>
      )}
    </div>
  );
} 