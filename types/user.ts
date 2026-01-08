/**
 * User 类型定义
 * 对应后端 internal/model/user.go
 */

import type { ApiResponse, PaginationResponse } from "./project";

// 用户基础类型
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  cnName?: string | null;
  alas?: string | null;
  phone?: string | null;
  extra: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

// 创建用户请求
export interface CreateUserRequest {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  cnName?: string | null;
  alas?: string | null;
  phone?: string | null;
  extra?: Record<string, string | number | boolean>;
}

// 更新用户请求
export interface UpdateUserRequest {
  name?: string;
  cnName?: string | null;
  alas?: string | null;
  phone?: string | null;
  extra?: Record<string, string | number | boolean>;
}

// 用户列表响应
export type UserListResponse = ApiResponse<PaginationResponse<User>>;

// 单个用户响应
export type UserResponse = ApiResponse<User>;
