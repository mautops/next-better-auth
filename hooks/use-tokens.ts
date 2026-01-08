import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiDelete, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import type {
  Token,
  TokenListResponse,
  TokenResponse,
  CreateTokenRequest,
  UpdateTokenRequest,
} from "@/types/token";

// Query Keys
export const tokenKeys = {
  all: ["tokens"] as const,
  lists: () => [...tokenKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...tokenKeys.lists(), filters] as const,
  detail: (id: string) => [...tokenKeys.all, "detail", id] as const,
};

// Hooks

/**
 * 获取 Token 列表
 */
export function useTokens() {
  return useQuery({
    queryKey: tokenKeys.lists(),
    queryFn: async () => {
      const response = await apiGet<TokenListResponse>("/api/tokens");
      return response.data?.data || [];
    },
  });
}

/**
 * 获取单个 Token
 */
export function useToken(id: string | null) {
  return useQuery({
    queryKey: tokenKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) return null;
      const response = await apiGet<TokenResponse>(`/api/tokens/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * 创建秘钥
 */
export function useCreateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTokenRequest) => {
      const response = await apiPost<TokenResponse>("/api/tokens", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.lists() });
      toast.success("创建成功");
    },
    onError: (error: Error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
}

/**
 * 更新秘钥
 */
export function useUpdateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateTokenRequest }) => {
      const response = await apiPost<TokenResponse>(`/api/tokens/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tokenKeys.detail(variables.id) });
      toast.success("更新成功");
    },
    onError: (error: Error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}

/**
 * 删除 Token
 */
export function useDeleteToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiDelete(`/api/tokens/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.all });
      toast.success("删除成功");
    },
    onError: (error: Error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
}
