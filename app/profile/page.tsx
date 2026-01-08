"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Save, X } from "lucide-react";
import type { User as PrismaUser } from "@/lib/generated/prisma/client";
import { ProfileHeaderCard } from "./components/profile-header-card";
import { ProfileDetailCard } from "./components/profile-detail-card";
import { ProfileStatusCard } from "./components/profile-status-card";

interface UserUpdateData {
  name: string;
  cn_name: string;
  alas: string;
  phone: string;
  extra: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<PrismaUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<UserUpdateData>({
    name: "",
    cn_name: "",
    alas: "",
    phone: "",
    extra: "{}",
  });

  // 从 API 获取完整的用户数据
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user) {
        setIsFetching(false);
        return;
      }

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            cn_name: data.user.cn_name || "",
            alas: data.user.alas || "",
            phone: data.user.phone || "",
            extra: JSON.stringify(data.user.extra || {}, null, 2),
          });
        }
      } catch (error) {
        console.error("获取用户资料失败:", error);
        toast.error("获取用户资料失败");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  // 处理表单输入变化
  const handleInputChange = (field: keyof UserUpdateData, value: string) => {
    setFormData((prev: UserUpdateData) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 开始编辑
  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      cn_name: user?.cn_name || "",
      alas: user?.alas || "",
      phone: user?.phone || "",
      extra: JSON.stringify(user?.extra || {}, null, 2),
    });
    setIsEditing(true);
  };

  // 取消编辑
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      cn_name: user?.cn_name || "",
      alas: user?.alas || "",
      phone: user?.phone || "",
      extra: JSON.stringify(user?.extra || {}, null, 2),
    });
  };

  // 保存更改
  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // 验证 JSON 格式
      let extraData;
      try {
        extraData = JSON.parse(formData.extra);
      } catch {
        toast.error("额外信息必须是有效的 JSON 格式");
        setIsLoading(false);
        return;
      }

      const updateData = {
        name: formData.name.trim(),
        cn_name: formData.cn_name.trim() || null,
        alas: formData.alas.trim() || null,
        phone: formData.phone.trim() || null,
        extra: extraData,
      };

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "更新失败");
      }

      const result = await response.json();

      // 更新本地用户数据
      setUser(result.user);
      setFormData({
        name: result.user.name || "",
        cn_name: result.user.cn_name || "",
        alas: result.user.alas || "",
        phone: result.user.phone || "",
        extra: JSON.stringify(result.user.extra || {}, null, 2),
      });

      toast.success("个人资料更新成功");
      setIsEditing(false);
    } catch (error) {
      console.error("更新个人资料失败:", error);
      toast.error(
        error instanceof Error ? error.message : "更新失败，请重试"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user || isFetching) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">个人资料</h1>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">
            {isFetching && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            )}
          </main>
        </SidebarInset>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">个人资料</h1>
          </header>
        </SidebarInset>
      </>
    );
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold">个人资料</h1>
          <div className="ml-auto flex items-center gap-2">
            {isEditing ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="size-4 mr-1" />
                    取消
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    <Save className="size-4 mr-1" />
                    {isLoading ? "保存中..." : "保存"}
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" onClick={handleEdit}>
                  <Edit className="size-4 mr-1" />
                  编辑资料
                </Button>
              </motion.div>
            )}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto w-full space-y-6"
          >
            <ProfileHeaderCard
              user={user}
              isEditing={isEditing}
              formName={formData.name}
              onNameChange={(value) => handleInputChange("name", value)}
            />

            <ProfileDetailCard
              user={user}
              isEditing={isEditing}
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ProfileStatusCard user={user} />
          </motion.div>
        </main>
      </SidebarInset>
    </>
  );
}