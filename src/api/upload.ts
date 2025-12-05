import apiClient from './axios';

export type UploadImageResponse = {
  url: string;
  publicId: string;
};

export type UploadVideoResponse = {
  url: string;
  publicId: string;
  duration?: number;
  format?: string;
  width?: number;
  height?: number;
};

// Upload API functions
export const uploadApi = {
  // Upload image to Cloudinary
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  // Upload video to Cloudinary
  uploadVideo: async (file: File, onProgress?: (progress: number) => void): Promise<UploadVideoResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data.data || response.data;
  },
};

