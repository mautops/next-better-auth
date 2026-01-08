/**
 * API 工具函数
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(path, API_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  const url = buildUrl(path, params);
  
  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/sign-in";
    }
    throw new ApiError("未授权，请先登录", 401);
  }

  if (!response.ok) {
    let errorMessage = `请求失败: ${response.status}`;
    let errorData: Record<string, string> | undefined;
    
    try {
      errorData = await response.json() as Record<string, string>;
      errorMessage = errorData.error || errorMessage;
    } catch {
      // 无法解析错误响应
    }
    
    throw new ApiError(errorMessage, response.status, errorData);
  }

  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  return apiFetch<T>(path, { method: "GET", params });
}

export async function apiPost<T>(
  path: string,
  data?: object
): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPut<T>(
  path: string,
  data?: object
): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiPatch<T>(
  path: string,
  data?: object
): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete<T>(
  path: string
): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE" });
}
