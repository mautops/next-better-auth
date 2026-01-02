export const siteConfig = {
  name: "UserCenter",
  title: "UserCenter",
  icon: "/favicon.ico",
  description: "用户中心",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "zh-CN",
  theme: {
    defaultTheme: "system" as "light" | "dark" | "system",
    enableSystem: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
