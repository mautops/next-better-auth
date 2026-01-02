import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TweakcnThemeProvider } from "@/components/theme/tweakcn-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "UserCenter",
  description: "用户中心",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <TweakcnThemeProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </TweakcnThemeProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
