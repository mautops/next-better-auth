import type { LucideIcon } from "lucide-react"
import { Box, Leaf, Waves, Flower, Sun, Database } from "lucide-react"
import type { ColorTheme } from "@/hooks/use-color-theme"

export interface ThemeConfig {
  name: string
  value: ColorTheme
  description: string
  icon: LucideIcon
}

export const themes: ThemeConfig[] = [
  {
    name: "紫罗兰绽",
    value: "violet-bloom",
    description: "紫罗兰绽放主题",
    icon: Flower,
  },
  {
    name: "日落余晖",
    value: "solar-dusk",
    description: "日落余晖主题",
    icon: Sun,
  },
  {
    name: "Supabase",
    value: "supabase",
    description: "Supabase 主题",
    icon: Database,
  },
  {
    name: "粘土形态",
    value: "claymorphism",
    description: "粘土形态主题",
    icon: Box,
  },
  {
    name: "自然翠绿",
    value: "nature",
    description: "自然主题",
    icon: Leaf,
  },
  {
    name: "海洋微风",
    value: "ocean-breeze",
    description: "海洋微风主题",
    icon: Waves,
  },
  {
    name: "量子玫瑰",
    value: "quantum-rose",
    description: "量子玫瑰主题",
    icon: Flower,
  },
  {
    name: "禅意花园",
    value: "sage-garden",
    description: "禅意花园主题",
    icon: Leaf,
  },
]
