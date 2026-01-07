"use client"

import { useState } from "react"
import { Check, Palette } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { themes } from "@/config/themes"
import { cn } from "@/lib/utils"
import { useColorTheme, type ColorTheme } from "@/hooks/use-color-theme"

export function ThemeSelector() {
  const { theme, setTheme, mounted } = useColorTheme()
  const [open, setOpen] = useState(false)

  // 避免 hydration 不匹配
  if (!mounted) {
    return null
  }

  const selectedTheme = themes.find((t) => t.value === theme)
  
  const handleThemeChange = (newTheme: ColorTheme) => {
    // 在切换主题前，临时禁用过渡效果
    const root = document.documentElement
    root.classList.add('theme-transitioning')
    
    setTheme(newTheme)
    setOpen(false)
    
    // 在下一帧移除禁用类
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.classList.remove('theme-transitioning')
      }, 0)
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarMenuButton
          size="default"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Palette className="size-4" />
          <span className="truncate text-sm">{selectedTheme?.name || "主题"}</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-2" align="end" side="right" sideOffset={4}>
        <div className="space-y-1">
          {themes.map((themeItem) => {
            const isSelected = theme === themeItem.value
            return (
              <button
                key={themeItem.value}
                onClick={() => handleThemeChange(themeItem.value)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-accent text-accent-foreground"
                )}
              >
                <themeItem.icon className="size-4" />
                <span className="flex-1 text-left">{themeItem.name}</span>
                <Check className={cn("size-4", isSelected ? "opacity-100" : "opacity-0")} />
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
