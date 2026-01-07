"use client"

import { useEffect, useState } from "react"

export type ColorTheme = 
  | "violet-bloom"
  | "solar-dusk"
  | "supabase"
  | "claymorphism"
  | "nature"
  | "ocean-breeze"
  | "quantum-rose"
  | "sage-garden"

const STORAGE_KEY = "color-theme"
const DEFAULT_THEME: ColorTheme = "violet-bloom"

function getStoredTheme(): ColorTheme {
  if (typeof window === "undefined") return DEFAULT_THEME
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorTheme | null
    if (stored && isValidTheme(stored)) {
      return stored
    }
  } catch (error) {
    console.error("Failed to get stored theme:", error)
  }
  
  return DEFAULT_THEME
}

function isValidTheme(theme: string): theme is ColorTheme {
  return [
    "violet-bloom",
    "solar-dusk",
    "supabase",
    "claymorphism",
    "nature",
    "ocean-breeze",
    "quantum-rose",
    "sage-garden",
  ].includes(theme)
}

export function useColorTheme() {
  const [theme, setThemeState] = useState<ColorTheme>(() => {
    // 在服务端渲染时使用默认主题，避免 hydration 不匹配
    if (typeof window === "undefined") return DEFAULT_THEME
    return getStoredTheme()
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 确保客户端主题与存储的主题同步
    const storedTheme = getStoredTheme()
    if (storedTheme !== theme) {
      setThemeState(storedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      // 使用 requestAnimationFrame 确保 DOM 更新的平滑性
      requestAnimationFrame(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem(STORAGE_KEY, theme)
      })
    } catch (error) {
      console.error("Failed to apply theme:", error)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme)
  }

  return { theme, setTheme, mounted }
}
