"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/utils/search-filter-bar";
import { Pagination } from "@/components/utils/pagination";
import { Plus } from "lucide-react";
import { useTokens, useDeleteToken } from "@/hooks/use-tokens";
import { toast } from "sonner";
import type { Token } from "@/types/token";
import { EmptyState } from "./components/empty-state";
import { TokenTable } from "./components/token-table";
import { CreateTokenSheet } from "./components/create-token-sheet";
import { TokenFormSheet } from "./components/token-form-sheet";

export default function TokensPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [editTokenId, setEditTokenId] = useState<string | null>(null);

  // React Query hooks
  const { data: tokens = [], isLoading, error } = useTokens();
  const deleteToken = useDeleteToken();

  // 客户端过滤
  const filteredTokens = tokens.filter((token: Token) => {
    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        token.id.toLowerCase().includes(query) ||
        token.accessToken.toLowerCase().includes(query) ||
        token.remark?.toLowerCase().includes(query) ||
        token.userId.toLowerCase().includes(query);
      
      if (!matchSearch) return false;
    }

    // 状态过滤
    if (statusFilter !== "all") {
      const status = statusFilter === "enabled" ? 1 : 0;
      if (token.status !== status) return false;
    }

    return true;
  });

  // 分页计算
  const totalPages = Math.ceil(filteredTokens.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTokens = filteredTokens.slice(startIndex, endIndex);

  // 重置到第一页当过滤条件改变时
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token 已复制到剪贴板");
  };

  const handleDelete = async (id: string) => {
    await deleteToken.mutateAsync(id);
  };

  const handleCreateToken = () => {
    setEditTokenId(null);
    setCreateSheetOpen(true);
  };

  const handleEditToken = (id: string) => {
    setEditTokenId(id);
    setCreateSheetOpen(true);
  };

  if (!session?.user) {
    return (
      <>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">秘钥管理</h1>
          </header>
        </SidebarInset>
      </>
    );
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        {session?.user && (
          <TokenFormSheet
            open={createSheetOpen}
            onOpenChange={setCreateSheetOpen}
            userId={session.user.id}
            tokenId={editTokenId}
          />
        )}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold">秘钥管理</h1>
          <div className="ml-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="sm" onClick={handleCreateToken}>
                <Plus className="size-4" />
                创建秘钥
              </Button>
            </motion.div>
          </div>
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
            ) : tokens.length === 0 ? (
              <EmptyState type="no-tokens" onCreateToken={handleCreateToken} />
            ) : (
              <>
                <SearchFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  filterValue={statusFilter}
                  onFilterChange={handleStatusFilterChange}
                  filterOptions={[
                    { value: "all", label: "全部状态" },
                    { value: "enabled", label: "启用" },
                    { value: "disabled", label: "禁用" },
                  ]}
                  searchPlaceholder="搜索 Token ID、备注或用户 ID..."
                  filterPlaceholder="状态筛选"
                />

                <Card>
                  <CardContent>
                    {filteredTokens.length === 0 ? (
                      <EmptyState type="no-results" />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <TokenTable
                          tokens={paginatedTokens}
                          onCopyToken={handleCopyToken}
                          onEditToken={handleEditToken}
                          onDeleteToken={handleDelete}
                          isDeleting={deleteToken.isPending}
                        />
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          pageSize={pageSize}
                          totalItems={filteredTokens.length}
                          onPageChange={setCurrentPage}
                          onPageSizeChange={(size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                          }}
                        />
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
