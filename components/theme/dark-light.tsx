"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export function DarkLightToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDarkLight = () => {
    // 在切换主题前，临时禁用过渡效果
    const root = document.documentElement
    root.classList.add('theme-transitioning')
    
    setTheme(theme === "dark" ? "light" : "dark")
    
    // 在下一帧移除禁用类，允许后续的交互过渡
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.classList.remove('theme-transitioning')
      }, 0)
    })
  }

  // 避免 hydration 不匹配
  if (!mounted) {
    return null
  }

  return (
    <SidebarMenuButton
      size="default"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      onClick={toggleDarkLight}
    >
      <div className="relative flex items-center justify-center">
        <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="text-sm">亮暗</span>
    </SidebarMenuButton>
  )
}

