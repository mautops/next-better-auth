import type { LucideIcon } from "lucide-react";
import { Home, Key, FolderKanban, Users } from "lucide-react";

export interface MenuSubItem {
  title: string;
  href: string;
}

export interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  subItems?: MenuSubItem[];
  defaultOpen?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    title: "首页",
    href: "/",
    icon: Home,
  },
  {
    title: "秘钥管理",
    href: "/tokens",
    icon: Key,
  },
  {
    title: "项目管理",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "用户管理",
    href: "/users",
    icon: Users,
  },
];
