"use client";

import { createContext, useContext, useState, useLayoutEffect, ReactNode } from "react";
import { tweakcnThemes, type TweakcnTheme } from "@/config/themes";

interface ThemeContextValue {
  selectedTheme: TweakcnTheme;
  setTheme: (theme: TweakcnTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "tweakcn-theme";
const STYLE_ID = "tweakcn-theme-style";
const DEFAULT_THEME: TweakcnTheme = "violet-bloom";

export function useTweakcnTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTweakcnTheme must be used within TweakcnThemeProvider");
  }
  return context;
}

function getRandomNonDefaultTheme(): TweakcnTheme {
  const nonDefaultThemes = tweakcnThemes.filter((t) => t.value !== "default" && t.cssFile);
  return nonDefaultThemes.length > 0
    ? nonDefaultThemes[Math.floor(Math.random() * nonDefaultThemes.length)].value
    : DEFAULT_THEME;
}

function normalizeTheme(theme: TweakcnTheme): TweakcnTheme {
  return theme === "default" ? getRandomNonDefaultTheme() : theme;
}

function getThemePath(cssFile: string | null): string | null {
  if (!cssFile) return null;
  return cssFile.startsWith("/") ? cssFile : `/${cssFile}`;
}

function loadThemeCSS(theme: TweakcnTheme): void {
  const existingLink = document.getElementById(STYLE_ID);
  if (existingLink) {
    existingLink.remove();
  }

  const themeData = tweakcnThemes.find((t) => t.value === theme);
  const cssPath = getThemePath(themeData?.cssFile ?? null);

  if (!cssPath) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssPath;
  link.id = STYLE_ID;

  link.onerror = () => {
    const fallbackTheme = tweakcnThemes.find(
      (t) => t.value !== theme && t.cssFile && t.value !== "default"
    );
    if (fallbackTheme) {
      document.documentElement.setAttribute("data-theme", fallbackTheme.value);
      loadThemeCSS(fallbackTheme.value);
    }
  };

  document.head.appendChild(link);
}

function applyTheme(theme: TweakcnTheme): void {
  const themeToApply = normalizeTheme(theme);
  document.documentElement.setAttribute("data-theme", themeToApply);
  loadThemeCSS(themeToApply);
}

function getInitialTheme(): TweakcnTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;

  const savedTheme = localStorage.getItem(STORAGE_KEY) as TweakcnTheme | null;
  if (savedTheme && tweakcnThemes.some((t) => t.value === savedTheme)) {
    return savedTheme;
  }
  return DEFAULT_THEME;
}

export function TweakcnThemeProvider({ children }: { children: ReactNode }) {
  const [selectedTheme, setSelectedThemeState] = useState<TweakcnTheme>(() => {
    if (typeof window !== "undefined") {
      return getInitialTheme();
    }
    return DEFAULT_THEME;
  });

  useLayoutEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  const setTheme = (theme: TweakcnTheme) => {
    const themeToApply = normalizeTheme(theme);
    setSelectedThemeState(themeToApply);
    applyTheme(themeToApply);
    localStorage.setItem(STORAGE_KEY, themeToApply);
  };

  return (
    <ThemeContext.Provider value={{ selectedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
