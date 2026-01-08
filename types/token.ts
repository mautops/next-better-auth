/**
 * Token 类型定义
 * 对应后端 internal/model/token.go
 */

import type { ApiResponse, PaginationResponse } from "./project";

// Token 基础类型
export interface Token {
  id: string;
  userId: string;
  accessToken: string;
  startTime?: string | null;
  endTime?: string | null;
  lastLoginAt?: string | null;
  remark?: string | null;
  status: number; // 0: 禁用, 1: 启用
  created: string;
  modified: string;
}

// 创建秘钥 请求
export interface CreateTokenRequest {
  userId: string;
  accessToken?: string;
  startTime?: string | null;
  endTime?: string | null;
  remark?: string | null;
  status?: number;
}

// 更新 Token 请求
export interface UpdateTokenRequest {
  startTime?: string | null;
  endTime?: string | null;
  lastLoginAt?: string | null;
  remark?: string | null;
  status?: number;
}

// Token 列表响应
export type TokenListResponse = ApiResponse<PaginationResponse<Token>>;

// 单个 Token 响应
export type TokenResponse = ApiResponse<Token>;
