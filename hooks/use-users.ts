import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import type {
  User,
  UserListResponse,
  UserResponse,
  UpdateUserRequest,
} from "@/types/user";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...userKeys.lists(), filters] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

// Hooks

/**
 * 获取用户列表
 */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await apiGet<UserListResponse>("/api/users");
      return response.data?.data || [];
    },
  });
}

/**
 * 获取当前用户资料
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await apiGet<UserResponse>("/api/user/profile");
      return response.data;
    },
  });
}

/**
 * 更新用户资料
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      const response = await apiPatch<UserResponse>("/api/user/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      toast.success("更新成功");
    },
    onError: (error: Error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}
