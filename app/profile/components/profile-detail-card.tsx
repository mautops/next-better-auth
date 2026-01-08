import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, FileText } from "lucide-react";
import { motion } from "motion/react";
import type { User as PrismaUser } from "@/lib/generated/prisma/client";

interface UserUpdateData {
  name: string;
  cn_name: string;
  alas: string;
  phone: string;
  extra: string;
}

interface ProfileDetailCardProps {
  user: PrismaUser;
  isEditing: boolean;
  formData: UserUpdateData;
  onInputChange: (field: keyof UserUpdateData, value: string) => void;
}

export function ProfileDetailCard({
  user,
  isEditing,
  formData,
  onInputChange,
}: ProfileDetailCardProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            详细信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 用户ID - 只读 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                用户ID
              </Label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded border">
                {user.id}
              </p>
            </div>

            {/* 姓名 */}
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => onInputChange("name", e.target.value)}
                  placeholder="请输入姓名"
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded border">{user.name}</p>
              )}
            </div>

            {/* 邮箱 - 只读 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                邮箱
              </Label>
              <p className="text-sm flex items-center gap-2 px-3 py-2 bg-muted rounded border">
                <Mail className="size-4" />
                {user.email}
              </p>
            </div>

            {/* 手机号 */}
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => onInputChange("phone", e.target.value)}
                  placeholder="请输入手机号"
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded border flex items-center gap-2">
                  <Phone className="size-4" />
                  {user.phone || "未设置"}
                </p>
              )}
            </div>

            {/* 中文姓名 */}
            <div className="space-y-2">
              <Label htmlFor="cn_name">中文姓名</Label>
              {isEditing ? (
                <Input
                  id="cn_name"
                  value={formData.cn_name}
                  onChange={(e) => onInputChange("cn_name", e.target.value)}
                  placeholder="请输入中文姓名"
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded border">
                  {user.cn_name || "未设置"}
                </p>
              )}
            </div>

            {/* 别名 */}
            <div className="space-y-2">
              <Label htmlFor="alas">别名</Label>
              {isEditing ? (
                <Input
                  id="alas"
                  value={formData.alas}
                  onChange={(e) => onInputChange("alas", e.target.value)}
                  placeholder="请输入别名"
                />
              ) : (
                <p className="px-3 py-2 bg-muted rounded border">
                  {user.alas || "未设置"}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* 额外信息 JSON */}
          <div className="space-y-2">
            <Label htmlFor="extra" className="flex items-center gap-2">
              <FileText className="size-4" />
              额外信息 (JSON 格式)
            </Label>
            {isEditing ? (
              <Textarea
                id="extra"
                value={formData.extra}
                onChange={(e) => onInputChange("extra", e.target.value)}
                placeholder='{"key": "value"}'
                className="font-mono text-sm min-h-32"
              />
            ) : (
              <pre className="text-sm bg-muted p-3 rounded border overflow-auto max-h-40">
                {JSON.stringify(user.extra || {}, null, 2)}
              </pre>
            )}
          </div>

          <Separator />

          {/* 时间信息 - 只读 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                注册时间
              </Label>
              <p className="text-sm flex items-center gap-2 px-3 py-2 bg-muted rounded border">
                <Calendar className="size-4" />
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                最后更新
              </Label>
              <p className="text-sm flex items-center gap-2 px-3 py-2 bg-muted rounded border">
                <Calendar className="size-4" />
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
