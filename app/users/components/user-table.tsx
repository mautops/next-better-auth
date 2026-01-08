import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type { User } from "@/types/user";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>用户</TableHead>
          <TableHead>邮箱</TableHead>
          <TableHead>手机号</TableHead>
          <TableHead>中文名</TableHead>
          <TableHead>别名</TableHead>
          <TableHead>邮箱验证</TableHead>
          <TableHead>注册时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <motion.tr
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitial(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {user.id.slice(0, 8)}...
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Mail className="size-3 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
            </TableCell>
            <TableCell>
              {user.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="size-3 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              {user.cnName ? (
                <Badge variant="secondary">{user.cnName}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              {user.alas ? (
                <Badge variant="outline">{user.alas}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </TableCell>
            <TableCell>
              {user.emailVerified ? (
                <div className="flex items-center gap-1 text-primary">
                  <CheckCircle2 className="size-4" />
                  <span className="text-sm">已验证</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <XCircle className="size-4" />
                  <span className="text-sm">未验证</span>
                </div>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(user.createdAt)}
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
