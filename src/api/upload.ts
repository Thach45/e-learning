import apiClient from './axios';

export type UploadImageResponse = {
  url: string;
  publicId: string;
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
};

