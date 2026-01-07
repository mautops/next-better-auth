import { z } from "zod";

// 用户资料更新的验证模式
export const updateProfileSchema = z.object({
  name: z.string().min(1, "姓名不能为空").max(100, "姓名长度不能超过100个字符"),
  cn_name: z.string().max(100, "中文姓名长度不能超过100个字符").nullable().optional(),
  alas: z.string().max(100, "别名长度不能超过100个字符").nullable().optional(),
  phone: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    return /^1[3-9]\d{9}$/.test(val);
  }, "请输入有效的手机号"),
  extra: z.record(z.string(), z.unknown()).optional(),
});

// 导出类型
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
