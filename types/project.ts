/**
 * Project 类型定义
 * 对应后端 internal/model/project.go
 */

// 项目基础类型
export interface Project {
  id: string;
  name: string;
  code: string;
  parentId?: string | null;
  depth: number;
  status: number; // 0: 禁用, 1: 启用
  created: string;
  modified: string;
}

// 项目树形结构
export interface ProjectTree extends Project {
  children?: ProjectTree[];
}

// 创建项目请求
export interface CreateProjectRequest {
  name: string;
  code: string;
  parentId?: string | null;
  status?: number;
}

// 更新项目请求
export interface UpdateProjectRequest {
  name?: string;
  code?: string;
  parentId?: string | null;
  status?: number;
}

// 后端统一响应结构
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

// 分页响应结构
export interface PaginationResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

// 项目列表响应
export type ProjectListResponse = ApiResponse<PaginationResponse<Project>>;

// 单个项目响应
export type ProjectResponse = ApiResponse<Project>;

// 项目树响应
export type ProjectTreeResponse = ApiResponse<ProjectTree[]>;
