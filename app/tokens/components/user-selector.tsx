"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { User, UserListResponse } from "@/types/user";

interface UserSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function UserSelector({ value, onValueChange, disabled }: UserSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const listRef = React.useRef<HTMLDivElement>(null);

  // 使用 infinite query 实现分页
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["users", "infinite", search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiGet<UserListResponse>(
        `/api/users?page=${pageParam}&pageSize=20&search=${encodeURIComponent(search)}`
      );
      return {
        users: response.data?.data || [],
        nextPage: pageParam + 1,
        hasMore: (response.data?.data || []).length === 20,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });

  // 合并所有页的用户数据
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.users) || [];
  }, [data]);

  // 找到选中的用户
  const selectedUser = users.find((user) => user.id === value);

  // 监听滚动事件，到底部时加载更多
  React.useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = listElement;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    listElement.addEventListener("scroll", handleScroll);
    return () => listElement.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedUser ? (
            <span className="truncate">
              {selectedUser.name} ({selectedUser.email})
            </span>
          ) : (
            "选择用户"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索用户..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList ref={listRef}>
            <CommandEmpty>
              {isLoading ? "加载中..." : "未找到用户"}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user: User) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">
                    {user.name} ({user.email})
                  </span>
                </CommandItem>
              ))}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    加载更多...
                  </span>
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
