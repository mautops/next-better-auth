"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TokenForm } from "./token-form";
import { motion, AnimatePresence } from "motion/react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface TokenFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  tokenId?: string | null;
}

export function TokenFormSheet({
  open,
  onOpenChange,
  userId,
  tokenId,
}: TokenFormSheetProps) {
  const isEdit = !!tokenId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto p-6">
        <VisuallyHidden.Root>
          <SheetTitle>{isEdit ? "编辑秘钥" : "创建秘钥"}</SheetTitle>
        </VisuallyHidden.Root>
        <AnimatePresence mode="wait">
          <motion.div
            key={tokenId || "create"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold">
                {isEdit ? "编辑秘钥" : "创建秘钥"}
              </h2>
            </div>
            <TokenForm
              userId={userId}
              tokenId={tokenId}
              onSuccess={() => onOpenChange(false)}
            />
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
