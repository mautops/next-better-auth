import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  ImageIcon,
  Phone,
  UserCircle,
  Tag,
  FileJson,
} from "lucide-react";
import { motion } from "motion/react";
import type { User as PrismaUser } from "@/lib/generated/prisma/client";

interface ProfileStatusCardProps {
  user: PrismaUser;
}

export function ProfileStatusCard({ user }: ProfileStatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>账户状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {/* 邮箱验证状态 */}
            <Badge variant={user.emailVerified ? "default" : "destructive"}>
              {user.emailVerified ? (
                <>
                  <CheckCircle2 className="size-3 mr-1" />
                  邮箱已验证
                </>
              ) : (
                <>
                  <XCircle className="size-3 mr-1" />
                  邮箱未验证
                </>
              )}
            </Badge>

            {/* 头像状态 */}
            <Badge variant={user.image ? "default" : "secondary"}>
              <ImageIcon className="size-3 mr-1" />
              {user.image ? "已设置头像" : "未设置头像"}
            </Badge>

            {/* 手机号状态 */}
            <Badge variant={user.phone ? "default" : "secondary"}>
              <Phone className="size-3 mr-1" />
              {user.phone ? "已绑定手机" : "未绑定手机"}
            </Badge>

            {/* 中文姓名状态 */}
            <Badge variant={user.cn_name ? "default" : "secondary"}>
              <UserCircle className="size-3 mr-1" />
              {user.cn_name ? "已设置中文姓名" : "未设置中文姓名"}
            </Badge>

            {/* 别名状态 */}
            <Badge variant={user.alas ? "default" : "secondary"}>
              <Tag className="size-3 mr-1" />
              {user.alas ? "已设置别名" : "未设置别名"}
            </Badge>

            {/* 额外信息状态 */}
            <Badge
              variant={
                user.extra && Object.keys(user.extra).length > 0
                  ? "default"
                  : "secondary"
              }
            >
              <FileJson className="size-3 mr-1" />
              {user.extra && Object.keys(user.extra).length > 0
                ? "包含额外信息"
                : "无额外信息"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
