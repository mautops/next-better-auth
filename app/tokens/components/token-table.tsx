import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Token } from "@/types/token";

interface TokenTableProps {
  tokens: Token[];
  onCopyToken: (token: string) => void;
  onEditToken: (id: string) => void;
  onDeleteToken: (id: string) => void;
  isDeleting?: boolean;
}

export function TokenTable({
  tokens,
  onCopyToken,
  onEditToken,
  onDeleteToken,
  isDeleting = false,
}: TokenTableProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge variant="default">
        启用
      </Badge>
    ) : (
      <Badge variant="secondary">禁用</Badge>
    );
  };

  const isExpired = (token: Token) => {
    if (!token.endTime) return false;
    return new Date(token.endTime) < new Date();
  };

  const getExpiryBadge = (token: Token) => {
    if (!token.startTime && !token.endTime) {
      return <Badge variant="outline">永久</Badge>;
    }
    
    if (isExpired(token)) {
      return <Badge variant="destructive">已过期</Badge>;
    }
    
    return <Badge variant="default">有效</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>开始时间</TableHead>
          <TableHead>结束时间</TableHead>
          <TableHead>是否过期</TableHead>
          <TableHead>最后登录</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>备注</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token, index) => (
          <motion.tr
            key={token.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <motion.code
                  whileHover={{ scale: 1.02 }}
                  className="bg-muted px-2 py-1 rounded text-xs font-mono max-w-[150px] truncate cursor-pointer hover:bg-muted/80"
                  onClick={() => onEditToken(token.id)}
                >
                  {token.accessToken}
                </motion.code>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopyToken(token.accessToken)}
                  >
                    <Copy className="size-3" />
                  </Button>
                </motion.div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(token.status)}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(token.startTime)}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(token.endTime)}
            </TableCell>
            <TableCell>{getExpiryBadge(token)}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(token.lastLoginAt)}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(token.created)}
            </TableCell>
            <TableCell>
              {token.remark || (
                <span className="text-muted-foreground">未命名</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isDeleting}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要删除这个 Token 吗？此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteToken(token.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
