import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Search, Plus } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  type: "no-tokens" | "no-results" | "loading" | "error";
  onCreateToken?: () => void;
}

export function EmptyState({ type, onCreateToken }: EmptyStateProps) {
  if (type === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-muted-foreground"
        >
          加载中...
        </motion.p>
      </motion.div>
    );
  }

  if (type === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <motion.p
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="text-destructive"
            >
              加载失败
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (type === "no-tokens") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Key className="size-12 text-muted-foreground mb-4" />
            </motion.div>
            <p className="text-muted-foreground mb-4">暂无 Token</p>
            {onCreateToken && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={onCreateToken}>
                  <Plus className="size-4 mr-1" />
                  创建第一个 Token
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (type === "no-results") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center h-64 text-muted-foreground"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Search className="size-12 mb-4" />
        </motion.div>
        <p>未找到匹配的 Token</p>
      </motion.div>
    );
  }

  return null;
}
