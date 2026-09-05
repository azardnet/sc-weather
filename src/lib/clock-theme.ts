export const CLOCK_THEMES = ["classic", "simple", "neon", "script"] as const;

export type ClockTheme = (typeof CLOCK_THEMES)[number];

export const DEFAULT_CLOCK_THEME: ClockTheme = "classic";

export const CLOCK_THEME_LABELS: Record<ClockTheme, { en: string; fa: string }> = {
  classic: { en: "Classic", fa: "اصلی" },
  simple: { en: "Simple", fa: "ساده" },
  neon: { en: "Neon", fa: "نئون" },
  script: { en: "Script", fa: "خوش‌نویس" },
};

export function parseClockTheme(value: string | null): ClockTheme {
  if (value === "simple" || value === "neon" || value === "script" || value === "classic") {
    return value;
  }
  return DEFAULT_CLOCK_THEME;
}

export function isOverlayClockTheme(theme: ClockTheme): boolean {
  return theme !== "classic";
}
