import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark";
export type ThemeColor = "orange" | "blue" | "green" | "purple" | "rose" | "teal";

export interface ThemeConfig {
  mode: ThemeMode;
  color: ThemeColor;
}

const THEME_KEY = "calc-theme";
const COLOR_KEY = "calc-theme-color";

export const themeColors: Record<ThemeColor, { label: string; hsl: string; preview: string }> = {
  orange: { label: "Orange", hsl: "24 95% 53%", preview: "#F97316" },
  blue: { label: "Blue", hsl: "217 91% 60%", preview: "#3B82F6" },
  green: { label: "Green", hsl: "142 71% 45%", preview: "#22C55E" },
  purple: { label: "Purple", hsl: "263 70% 58%", preview: "#8B5CF6" },
  rose: { label: "Rose", hsl: "347 77% 50%", preview: "#E11D48" },
  teal: { label: "Teal", hsl: "173 80% 40%", preview: "#14B8A6" },
};

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(THEME_KEY) as ThemeMode) || "dark";
    }
    return "dark";
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(COLOR_KEY) as ThemeColor) || "orange";
    }
    return "orange";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    const hsl = themeColors[color].hsl;
    document.documentElement.style.setProperty("--primary", hsl);
    document.documentElement.style.setProperty("--accent", hsl);
    document.documentElement.style.setProperty("--ring", hsl);
    document.documentElement.style.setProperty("--calc-operator", hsl);
    document.documentElement.style.setProperty("--nav-active", hsl);
    localStorage.setItem(COLOR_KEY, color);
  }, [color]);

  const toggle = useCallback(() => {
    setMode(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setColor = useCallback((c: ThemeColor) => {
    setColorState(c);
  }, []);

  // Alias for backward compatibility
  const theme = mode;
  const setTheme = setMode;

  return { theme, color, toggle, setColor, setTheme, setMode };
}
