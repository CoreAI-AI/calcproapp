import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("calc-theme") as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("calc-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle, setTheme: setThemeState };
}
