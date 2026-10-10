"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  variant?: "pill" | "icon" | "minimal";
  className?: string;
}

export default function ThemeToggle({
  variant = "pill",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (variant === "icon") {
      return (
        <div
          className={`w-8 h-8 rounded-full border border-[#D5CFC5] dark:border-[#2D2A25] bg-white/50 dark:bg-[#1E1C19] shrink-0 ${className}`}
          aria-hidden="true"
        />
      );
    }
    return (
      <div
        className={`inline-flex items-center rounded-full p-0.5 border border-[#DDD5C8] dark:border-[#2D2A25] bg-[#EFECE6]/70 dark:bg-[#1A1816] w-[112px] h-[28px] ${className}`}
        aria-hidden="true"
      />
    );
  }

  // Simple circular icon button variant (sits cleanly beside Cart button)
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(e) => toggleTheme(e)}
        className={`w-8 h-8 rounded-full border border-[#D5CFC5] hover:border-[#1E1E1C] dark:border-[#2D2A25] dark:hover:border-[#E8E2D8] flex items-center justify-center transition-all bg-white/60 hover:bg-white dark:bg-[#1E1C19] dark:hover:bg-[#282622] text-[#20201D] dark:text-[#FAF7F2] shadow-2xs group cursor-pointer shrink-0 ${className}`}
        aria-label={isDark ? "Switch to Natural Daylight (Light Mode)" : "Switch to Museum Spotlight (Dark Mode)"}
        title={isDark ? "Switch to Natural Daylight" : "Switch to Museum Spotlight"}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-[#FAF7F2] transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.8} />
        ) : (
          <Moon className="w-4 h-4 text-[#20201D] transition-transform duration-200 group-hover:-rotate-12" strokeWidth={1.8} />
        )}
      </button>
    );
  }

  // Segmented Pill variant (for Utility Bar, Mobile Drawer, and Footer)
  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 border border-[#DDD5C8] dark:border-[#2D2A25] bg-[#EFECE6]/70 dark:bg-[#1A1816] transition-colors h-[28px] ${className}`}
      title={isDark ? "Ambient Mode: Museum Spotlight (Dark)" : "Ambient Mode: Natural Daylight (Light)"}
    >
      <button
        type="button"
        onClick={(e) => setTheme("light", e)}
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
          !isDark
            ? "bg-white text-[#1E1E1C] shadow-2xs"
            : "text-[#8C877E] hover:text-[#FAF7F2]"
        }`}
        aria-label="Natural Daylight mode"
      >
        <Sun className={`w-3 h-3 ${!isDark ? "text-[#C2410C]" : ""}`} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={(e) => setTheme("dark", e)}
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
          isDark
            ? "bg-[#282622] text-[#FAF7F2] shadow-2xs"
            : "text-[#6E6A62] hover:text-[#1E1E1C]"
        }`}
        aria-label="Museum Spotlight dark mode"
      >
        <Moon className={`w-3 h-3 ${isDark ? "text-[#E5A83B]" : ""}`} />
        <span>Dark</span>
      </button>
    </div>
  );
}
