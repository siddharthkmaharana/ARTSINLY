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
    // Avoid hydration mismatch by rendering placeholder structure
    return (
      <div className={`inline-flex items-center rounded-full p-1 border border-[#DDD5C8] dark:border-[#38342E] bg-white/60 dark:bg-[#1E1C19] w-[62px] h-[28px] ${className}`} />
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-1.5 rounded-full border border-[#D5CFC5] hover:border-[#1E1E1C] dark:border-[#38342E] dark:hover:border-[#E8E2D8] text-[#1E1E1C] dark:text-[#FAF7F2] bg-white/60 dark:bg-[#1E1C19] transition-all shadow-2xs ${className}`}
        aria-label={isDark ? "Switch to Natural Daylight (Light)" : "Switch to Museum Spotlight (Dark)"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-[#E5A83B]" />
        ) : (
          <Moon className="w-4 h-4 text-[#4A4742]" />
        )}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 border border-[#DDD5C8] dark:border-[#38342E] bg-[#EFECE6]/70 dark:bg-[#1A1916] transition-colors ${className}`}
      title={isDark ? "Current: Museum Dark Mode" : "Current: Daylight Light Mode"}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
          !isDark
            ? "bg-white text-[#1E1E1C] shadow-2xs font-semibold"
            : "text-[#8C877E] hover:text-[#FAF7F2]"
        }`}
        aria-label="Natural Daylight mode"
      >
        <Sun className={`w-3 h-3 ${!isDark ? "text-[#C2410C]" : ""}`} />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
          isDark
            ? "bg-[#282622] text-[#FAF7F2] shadow-2xs font-semibold"
            : "text-[#6E6A62] hover:text-[#1E1E1C]"
        }`}
        aria-label="Museum Spotlight dark mode"
      >
        <Moon className={`w-3 h-3 ${isDark ? "text-[#E5A83B]" : ""}`} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
