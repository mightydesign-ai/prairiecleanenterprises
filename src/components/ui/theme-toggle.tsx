"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "pce-theme";

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/**
 * Two-state toggle. Until someone chooses, the site follows the OS setting
 * (applied before paint by the script in layout.tsx) and keeps following it
 * if the OS switches. A choice is remembered in localStorage.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch {
        // Storage blocked: keep following the system.
      }
      if (saved === "light" || saved === "dark") return;
      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = () => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : isDark}
      className="pressable inline-flex size-11 items-center justify-center rounded-md text-fg hover:bg-surface-sunken"
    >
      <span className="sr-only">Dark theme</span>
      {/* Sun shows in dark mode, moon in light mode; both drawn in currentColor. */}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 dark:hidden">
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden size-5 dark:block">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
