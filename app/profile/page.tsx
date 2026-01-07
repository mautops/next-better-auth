"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Mail, Phone, Calendar, User, Edit, Save, X, FileText, CheckCircle2, XCircle, Image as ImageIcon, UserCircle, Tag, FileJson } from "lucide-react";
import type { User as PrismaUser } from "@/lib/generated/prisma/client";
import type { UserUpdateData } from "@/types/user";

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

  // 获取用户姓名首字符作为头像
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // 格式化日期
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 处理表单输入变化
  const handleInputChange = (field: keyof UserUpdateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      toast.error(error instanceof Error ? error.message : "更新失败，请重试");
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
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {isFetching ? "加载中..." : "请先登录查看个人资料"}
              </p>
            </div>
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
          <main className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">请先登录查看个人资料</p>
            </div>
          </main>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="size-4 mr-1" />
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="size-4 mr-1" />
                  {isLoading ? "保存中..." : "保存"}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleEdit}>
                <Edit className="size-4 mr-1" />
                编辑资料
              </Button>
            )}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* 用户基本信息卡片 */}
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
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
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

            {/* 详细信息卡片 */}
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
                    <Label className="text-sm font-medium text-muted-foreground">用户ID</Label>
                    <p className="text-sm font-mono bg-muted px-3 py-2 rounded border">{user.id}</p>
                  </div>
                  
                  {/* 姓名 */}
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="请输入姓名"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded border">{user.name}</p>
                    )}
                  </div>

                  {/* 邮箱 - 只读 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">邮箱</Label>
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
                        onChange={(e) => handleInputChange("phone", e.target.value)}
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
                        onChange={(e) => handleInputChange("cn_name", e.target.value)}
                        placeholder="请输入中文姓名"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded border">{user.cn_name || "未设置"}</p>
                    )}
                  </div>

                  {/* 别名 */}
                  <div className="space-y-2">
                    <Label htmlFor="alas">别名</Label>
                    {isEditing ? (
                      <Input
                        id="alas"
                        value={formData.alas}
                        onChange={(e) => handleInputChange("alas", e.target.value)}
                        placeholder="请输入别名"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-muted rounded border">{user.alas || "未设置"}</p>
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
                      onChange={(e) => handleInputChange("extra", e.target.value)}
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
                    <Label className="text-sm font-medium text-muted-foreground">注册时间</Label>
                    <p className="text-sm flex items-center gap-2 px-3 py-2 bg-muted rounded border">
                      <Calendar className="size-4" />
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">最后更新</Label>
                    <p className="text-sm flex items-center gap-2 px-3 py-2 bg-muted rounded border">
                      <Calendar className="size-4" />
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 账户状态卡片 */}
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
                  <Badge variant={user.extra && Object.keys(user.extra).length > 0 ? "default" : "secondary"}>
                    <FileJson className="size-3 mr-1" />
                    {user.extra && Object.keys(user.extra).length > 0 ? "包含额外信息" : "无额外信息"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}