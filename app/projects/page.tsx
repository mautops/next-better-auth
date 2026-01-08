"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderKanban, Plus, Edit, Trash2, Calendar, FileText } from "lucide-react";
import { useProjects, useCreateProject, useDeleteProject } from "@/hooks/use-projects";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  // React Query hooks
  const { data: projects = [], isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      return;
    }

    await createProject.mutateAsync({
      name: formData.name,
      code: formData.code,
    });

    setIsCreateDialogOpen(false);
    setFormData({ name: "", code: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个项目吗？")) {
      return;
    }
    await deleteProject.mutateAsync(id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!session?.user) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">项目管理</h1>
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
          <h1 className="text-lg font-semibold">项目管理</h1>
          <div className="ml-auto">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm">
                    <Plus className="size-4 mr-1" />
                    创建项目
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新项目</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">项目名称</Label>
                    <Input
                      id="name"
                      placeholder="请输入项目名称"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">项目编码</Label>
                    <Input
                      id="code"
                      placeholder="请输入项目编码"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={createProject.isPending || !formData.name.trim()}
                    className="w-full"
                  >
                    {createProject.isPending ? "创建中..." : "创建"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <p className="text-destructive">加载失败</p>
                </CardContent>
              </Card>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <FolderKanban className="size-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">暂无项目</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="size-4 mr-1" />
                    创建第一个项目
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {projects.map((project: Project, index: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            ID: {project.id}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-2">
                        <FileText className="size-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          编码: {project.code}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {formatDate(project.created)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="size-4 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          disabled={deleteProject.isPending}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </main>
      </SidebarInset>
    </>
  );
}
