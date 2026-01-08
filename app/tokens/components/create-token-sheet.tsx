"use client";

import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";
import { CreateTokenForm } from "./create-token-form";

interface CreateTokenSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function CreateTokenSheet({
  open,
  onOpenChange,
  userId,
}: CreateTokenSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">创建秘钥</h2>
            <p className="text-sm text-muted-foreground mt-1">
              填写以下信息创建新的秘钥 Token
            </p>
          </div>
          <CreateTokenForm userId={userId} onSuccess={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
