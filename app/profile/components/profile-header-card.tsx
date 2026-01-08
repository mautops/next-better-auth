import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { motion } from "motion/react";
import type { User as PrismaUser } from "@/lib/generated/prisma/client";

interface ProfileHeaderCardProps {
  user: PrismaUser;
  isEditing: boolean;
  formName: string;
  onNameChange: (value: string) => void;
}

export function ProfileHeaderCard({
  user,
  isEditing,
  formName,
  onNameChange,
}: ProfileHeaderCardProps) {
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {isEditing ? (
                  <Input
                    value={formName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="text-2xl font-bold h-auto p-1 border-0 shadow-none focus-visible:ring-1"
                    placeholder="请输入姓名"
                  />
                ) : (
                  user.name
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="size-4" />
                {user.email}
              </CardDescription>
              {user.emailVerified && (
                <Badge variant="secondary" className="w-fit">
                  邮箱已验证
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
