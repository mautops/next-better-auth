"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ExternalLink,
  ChevronDown,
  GripVertical,
  LogIn,
  LogOut,
  User,
  Contact,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { DarkLightToggle } from "@/components/theme/dark-light";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { siteConfig } from "@/config/site";
import { menuItems } from "@/config/menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function AppSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const isLoggedIn = !!user;

  // 获取用户姓名首字符作为头像
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // 获取用户显示名称
  const getUserDisplayName = () => {
    return user?.name || "用户";
  };

  // 获取用户邮箱
  const getUserEmail = () => {
    return user?.email || "";
  };

  // 处理登出
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          {/* Logo */}
          <Contact className="size-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {siteConfig.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {siteConfig.description}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                if (item.subItems) {
                  return (
                    <Collapsible key={item.title} defaultOpen={item.defaultOpen}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <Icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href || "#"}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 官方文档 */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="https://docs.example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="size-4" />
                    <span>官方文档</span>
                    <ExternalLink className="ml-auto size-4" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 用户信息或登录 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoggedIn ? (
                <SidebarMenuItem>
                  <Menubar className="border-0 bg-transparent p-0 h-auto">
                    <MenubarMenu>
                      <MenubarTrigger asChild>
                        <SidebarMenuButton className="w-full h-auto py-2">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-muted">
                              {getUserInitial()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 min-w-0 items-start">
                            <span className="text-sm font-medium truncate">
                              {getUserDisplayName()}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {getUserEmail()}
                            </span>
                          </div>
                          <GripVertical className="size-4 text-muted-foreground shrink-0 ml-auto" />
                        </SidebarMenuButton>
                      </MenubarTrigger>
                      <MenubarContent align="start" side="right" className="w-56">
                        <MenubarItem onClick={() => router.push("/profile")}>
                          <User className="mr-2 size-4" />
                          <span>个人资料</span>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={handleSignOut}>
                          <LogOut className="mr-2 size-4" />
                          <span>退出登录</span>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-auto py-2">
                    <Link href="/auth/sign-in">
                      <LogIn className="size-4" />
                      <span>登录</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 设置 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 w-full">
                  <DarkLightToggle />
                  <Separator orientation="vertical" className="h-4" />
                  <ThemeSelector />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
