"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Loader2 } from "lucide-react";
import { useCreateToken, useUpdateToken, useToken } from "@/hooks/use-tokens";
import type { CreateTokenRequest } from "@/types/token";
import { UserSelector } from "./user-selector";

interface TokenFormProps {
  userId: string;
  tokenId?: string | null;
  onSuccess?: () => void;
}

export function TokenForm({ userId, tokenId, onSuccess }: TokenFormProps) {
  const isEdit = !!tokenId;
  const createToken = useCreateToken();
  const updateToken = useUpdateToken();
  const { data: existingToken, isLoading: isLoadingToken } = useToken(tokenId || null);

  // 初始化表单数据，如果有现有 Token 则使用其数据
  const initialFormData: CreateTokenRequest = existingToken
    ? {
        userId: existingToken.userId,
        accessToken: existingToken.accessToken,
        remark: existingToken.remark || "",
        status: existingToken.status,
        startTime: existingToken.startTime || null,
        endTime: existingToken.endTime || null,
      }
    : {
        userId,
        accessToken: "",
        remark: "",
        status: 1,
        startTime: null,
        endTime: null,
      };

  const [formData, setFormData] = useState<CreateTokenRequest>(initialFormData);

  // 当 existingToken 加载完成后更新表单
  useEffect(() => {
    if (existingToken && isEdit) {
      setFormData({
        userId: existingToken.userId,
        accessToken: existingToken.accessToken,
        remark: existingToken.remark || "",
        status: existingToken.status,
        startTime: existingToken.startTime || null,
        endTime: existingToken.endTime || null,
      });
    }
  }, [existingToken?.id, isEdit]); // 只在 token ID 变化时更新

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.accessToken?.trim()) {
      return;
    }

    if (isEdit && tokenId) {
      await updateToken.mutateAsync(
        { id: tokenId, data: formData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      await createToken.mutateAsync(formData, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  const handleChange = (
    field: keyof CreateTokenRequest,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateUUID = () => {
    const uuid = crypto.randomUUID();
    handleChange("accessToken", uuid);
  };

  if (isLoadingToken) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  const isPending = createToken.isPending || updateToken.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="accessToken">
          秘钥 Token <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="accessToken"
            placeholder="请输入秘钥 Token"
            value={formData.accessToken}
            onChange={(e) => handleChange("accessToken", e.target.value)}
            required
            className="flex-1"
            disabled={isEdit}
          />
          {!isEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={generateUUID}
              title="生成 UUID"
            >
              <RefreshCw className="size-4" />
            </Button>
          )}
        </div>
        {!isEdit && (
          <p className="text-xs text-muted-foreground">
            点击右侧按钮可自动生成 UUID
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userId">
            用户 <span className="text-destructive">*</span>
          </Label>
          <UserSelector
            value={formData.userId}
            onValueChange={(value) => handleChange("userId", value)}
            disabled={isEdit}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">状态</Label>
          <Select
            value={formData.status?.toString()}
            onValueChange={(value) => handleChange("status", Number(value))}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">启用</SelectItem>
              <SelectItem value="0">禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">开始时间</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime || ""}
            onChange={(e) =>
              handleChange("startTime", e.target.value || null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">结束时间</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime || ""}
            onChange={(e) => handleChange("endTime", e.target.value || null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remark">备注</Label>
        <Textarea
          id="remark"
          placeholder="请输入备注信息"
          value={formData.remark || ""}
          onChange={(e) => handleChange("remark", e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "处理中..." : isEdit ? "更新" : "创建"}
        </Button>
      </div>
    </form>
  );
}
