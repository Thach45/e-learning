import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../api/upload';

// Upload image mutation
export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
  });
};

// Upload video mutation
export const useUploadVideo = () => {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      uploadApi.uploadVideo(file, onProgress),
  });
};

