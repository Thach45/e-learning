import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api/documents';
import type { GetDocumentsParams, CreateDocumentBody, UpdateDocumentBody } from '../api/documents';

// Query keys
const DOCUMENTS_KEY = 'documents';
const DOCUMENT_KEY = 'document';
const TRENDING_KEY = 'trending-documents';
const TOP_CONTRIBUTORS_KEY = 'top-contributors';
const MY_DOCUMENTS_KEY = 'my-documents';
const MY_LIKED_DOCUMENTS_KEY = 'my-liked-documents';

// Queries
export const useDocuments = (params?: GetDocumentsParams) => {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, params],
    queryFn: () => documentsApi.getDocuments(params),
  });
};

export const useDocument = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [DOCUMENT_KEY, id],
    queryFn: () => documentsApi.getDocumentById(id),
    enabled: enabled && !!id,
  });
};

export const useTrendingDocuments = (limit = 10) => {
  return useQuery({
    queryKey: [TRENDING_KEY, limit],
    queryFn: () => documentsApi.getTrendingDocuments(limit),
  });
};

export const useTopContributors = (limit = 10) => {
  return useQuery({
    queryKey: [TOP_CONTRIBUTORS_KEY, limit],
    queryFn: () => documentsApi.getTopContributors(limit),
  });
};

export const useMyDocuments = (params?: GetDocumentsParams) => {
  return useQuery({
    queryKey: [MY_DOCUMENTS_KEY, params],
    queryFn: () => documentsApi.getMyDocuments(params),
  });
};

export const useMyLikedDocuments = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: [MY_LIKED_DOCUMENTS_KEY, page, limit],
    queryFn: () => documentsApi.getMyLikedDocuments(page, limit),
  });
};

// Mutations
export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDocumentBody) => documentsApi.createDocument(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOP_CONTRIBUTORS_KEY] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentBody }) =>
      documentsApi.updateDocument(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [MY_DOCUMENTS_KEY] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOP_CONTRIBUTORS_KEY] });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.toggleLike(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [TRENDING_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_LIKED_DOCUMENTS_KEY] });
    },
  });
};

export const useTrackDownload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.trackDownload(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEY, id] });
    },
  });
};

// Admin mutations
export const useToggleVerified = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      documentsApi.toggleVerified(id, isVerified),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_KEY, variables.id] });
    },
  });
};

export const useAdminDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.adminDeleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TOP_CONTRIBUTORS_KEY] });
    },
  });
};

