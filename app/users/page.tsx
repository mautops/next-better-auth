"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { SearchFilterBar } from "@/components/utils/search-filter-bar";
import { useUsers } from "@/hooks/use-users";
import type { User } from "@/types/user";
import { EmptyState } from "./components/empty-state";
import { UserTable } from "./components/user-table";

export default function UsersPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");

  // React Query hook
  const { data: users = [], isLoading, error } = useUsers();

  // 客户端过滤
  const filteredUsers = users.filter((user: User) => {
    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.cnName?.toLowerCase().includes(query) ||
        user.alas?.toLowerCase().includes(query) ||
        user.phone?.includes(query) ||
        user.id.toLowerCase().includes(query);
      
      if (!matchSearch) return false;
    }

    // 邮箱验证状态过滤
    if (verifiedFilter !== "all") {
      const isVerified = verifiedFilter === "verified";
      if (user.emailVerified !== isVerified) return false;
    }

    return true;
  });

  if (!session?.user) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">用户管理</h1>
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
          <h1 className="text-lg font-semibold">用户管理</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto w-full space-y-4"
          >
            {isLoading ? (
              <EmptyState type="loading" />
            ) : error ? (
              <EmptyState type="error" />
            ) : users.length === 0 ? (
              <EmptyState type="no-users" />
            ) : (
              <>
                <SearchFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterValue={verifiedFilter}
                  onFilterChange={setVerifiedFilter}
                  filterOptions={[
                    { value: "all", label: "全部用户" },
                    { value: "verified", label: "已验证" },
                    { value: "unverified", label: "未验证" },
                  ]}
                  searchPlaceholder="搜索用户名、邮箱、手机号、中文名或别名..."
                  filterPlaceholder="邮箱验证"
                />

                <Card>
                  <CardContent>
                    {filteredUsers.length === 0 ? (
                      <EmptyState type="no-results" />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <UserTable users={filteredUsers} />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>
        </main>
      </SidebarInset>
    </>
  );
}
