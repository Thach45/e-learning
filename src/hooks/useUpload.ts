import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../api/upload';

// Upload image mutation
export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
  });
};

