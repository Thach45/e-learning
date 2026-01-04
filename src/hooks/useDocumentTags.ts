import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  documentTagsApi, 
  type GetDocumentTagsParams, 
  type CreateDocumentTagBody, 
  type UpdateDocumentTagBody 
} from '../api/documentTags';

// Query keys
const DOCUMENT_TAGS_KEY = 'documentTags';

// Hook to get document tags
export const useDocumentTags = (params?: GetDocumentTagsParams) => {
  return useQuery({
    queryKey: [DOCUMENT_TAGS_KEY, params],
    queryFn: () => documentTagsApi.getTags(params),
  });
};

// Hook to get a single document tag
export const useDocumentTag = (id: string) => {
  return useQuery({
    queryKey: [DOCUMENT_TAGS_KEY, id],
    queryFn: () => documentTagsApi.getTagById(id),
    enabled: !!id,
  });
};

// Hook to create a document tag
export const useCreateDocumentTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body: CreateDocumentTagBody) => documentTagsApi.createTag(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_TAGS_KEY] });
    },
  });
};

// Hook to update a document tag
export const useUpdateDocumentTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentTagBody }) => 
      documentTagsApi.updateTag(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_TAGS_KEY] });
    },
  });
};

// Hook to delete a document tag
export const useDeleteDocumentTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => documentTagsApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_TAGS_KEY] });
    },
  });
};

