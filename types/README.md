# 类型定义说明

本目录包含前端应用的所有类型定义，与后端 Go 模型保持一致。

## 文件结构

- `project.ts` - 项目相关类型（对应 `internal/model/project.go`）
- `token.ts` - Token 相关类型（对应 `internal/model/token.go`）
- `user.ts` - 用户相关类型（对应 `internal/model/user.go`）

## 类型命名规范

### 请求类型
- `Create{Model}Request` - 创建资源的请求体
- `Update{Model}Request` - 更新资源的请求体

### 响应类型
- `{Model}` - 基础模型类型
- `{Model}ListResponse` - 列表响应（包含分页信息）
- `{Model}Response` - 单个资源响应

### 通用类型
- `ApiResponse<T>` - 后端统一响应结构
- `PaginationResponse<T>` - 分页响应结构

## 字段命名对照

### 后端 Go → 前端 TypeScript

| Go (snake_case/camelCase) | TypeScript (camelCase) |
|---------------------------|------------------------|
| `created`                 | `created`              |
| `modified`                | `modified`             |
| `cn_name`                 | `cnName`               |
| `access_token`            | `accessToken`          |
| `user_id`                 | `userId`               |
| `parent_id`               | `parentId`             |

## 使用示例

```typescript
import type { Project, CreateProjectRequest } from "@/types/project";
import type { Token, TokenListResponse } from "@/types/token";
import type { User, UpdateUserRequest } from "@/types/user";

// 在 React Query hooks 中使用
const response = await apiGet<ProjectListResponse>("/api/projects");
const projects = response.data?.data || [];

// 在组件中使用
const project: Project = {
  id: "123",
  name: "项目名称",
  code: "PROJECT_CODE",
  depth: 0,
  status: 1,
  created: "2024-01-01T00:00:00Z",
  modified: "2024-01-01T00:00:00Z",
};
```

## 注意事项

1. **类型同步**：当后端模型发生变化时，必须同步更新对应的前端类型定义
2. **字段命名**：前端使用 camelCase，后端 JSON 序列化也使用 camelCase
3. **可选字段**：使用 `?` 标记可选字段，使用 `| null` 表示可为空的字段
4. **时间格式**：所有时间字段在前端都是 `string` 类型（ISO 8601 格式）
