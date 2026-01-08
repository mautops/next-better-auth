import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import type {
  ProjectListResponse,
  ProjectResponse,
  ProjectTreeResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/types/project";

// Query Keys
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters?: Record<string, string | number | boolean>) => [...projectKeys.lists(), filters] as const,
  tree: () => [...projectKeys.all, "tree"] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Hooks

/**
 * 获取项目列表
 */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const response = await apiGet<ProjectListResponse>("/api/projects");
      return response.data?.data || [];
    },
  });
}

/**
 * 获取项目树
 */
export function useProjectTree() {
  return useQuery({
    queryKey: projectKeys.tree(),
    queryFn: async () => {
      const response = await apiGet<ProjectTreeResponse>("/api/projects/tree");
      return response.data || [];
    },
  });
}

/**
 * 获取单个项目
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const response = await apiGet<ProjectResponse>(`/api/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * 创建项目
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const response = await apiPost<ProjectResponse>("/api/projects", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.tree() });
      toast.success("创建成功");
    },
    onError: (error: Error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });
}

/**
 * 更新项目
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectRequest }) => {
      const response = await apiPut<ProjectResponse>(`/api/projects/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.tree() });
      toast.success("更新成功");
    },
    onError: (error: Error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });
}

/**
 * 删除项目
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiDelete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("删除成功");
    },
    onError: (error: Error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });
}
