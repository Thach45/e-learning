'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { File, Upload, X } from 'lucide-react';
import { ChangeEvent } from 'react';
import { useToast } from '../ui/use-toast';

interface LessonAttachmentUploadProps {
  defaultValue?: {
    title: string;
    url: string;
  }[];
  onUploadSuccess: (data: {
    title: string;
    url: string;
  }[]) => void;
}

export default function LessonAttachmentUpload({
  defaultValue = [],
  onUploadSuccess,
}: LessonAttachmentUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localAttachments, setLocalAttachments] = useState(defaultValue);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Chỉ chấp nhận file PDF",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Vui lòng chọn file trước khi upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const newAttachment = {
        title: selectedFile.name,
        url: data.url,
      };

      const newAttachments = [...localAttachments, newAttachment];
      setLocalAttachments(newAttachments);
      onUploadSuccess(newAttachments);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newAttachments = [...localAttachments];
    newAttachments.splice(index, 1);
    setLocalAttachments(newAttachments);
    onUploadSuccess(newAttachments);
    toast({
      title: "Success",
      description: "File removed successfully",
    });
  };

  const handleCancelSelect = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        <span>Tài liệu đính kèm</span>
        <div className="flex gap-2">
          <Button
            onClick={() => document.getElementById('file')?.click()}
            disabled={isUploading}
            variant="outline"
            type="button"
          >
            <File className="h-4 w-4 mr-2" />
            Chọn file
          </Button>
        </div>
      </div>

      <input
        id="file"
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleFileSelect}
      />

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-slate-100 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Đang tải lên...' : 'Upload'}
              </Button>
              <Button
                onClick={handleCancelSelect}
                variant="ghost"
                size="sm"
                disabled={isUploading}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {localAttachments.length === 0 && !selectedFile && (
        <p className="text-sm text-slate-500 italic">
          Không có tài liệu đính kèm
        </p>
      )}

      {localAttachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center gap-x-2 bg-slate-200 rounded-md mt-2 p-3"
        >
          <File className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm line-clamp-1">{attachment.title}</p>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="ml-auto hover:opacity-75 transition"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
} 