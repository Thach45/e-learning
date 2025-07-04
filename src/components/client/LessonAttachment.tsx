'use client';

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"

interface LessonAttachmentProps {
  attachments: {
    title: string
    url: string
  }[]
}

export default function LessonAttachment({ attachments }: LessonAttachmentProps) {
  

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {attachments.map((attachment, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start space-x-4">
            <div className="bg-slate-100 p-2 rounded-lg">
              <FileText className="h-8 w-8 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{attachment.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">PDF Document</p>
              <div className="flex gap-2 mt-3">
                
                <Button 
                  size="sm"
                  onClick={() => handleDownload(attachment.url, attachment.title)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 