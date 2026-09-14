export interface CountdownGoal {
  name: string;
  targetAt: number;
}

export interface CountdownRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

const STORAGE_KEY = "countdown_goal";

export function loadCountdownGoal(): CountdownGoal | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      "targetAt" in parsed &&
      typeof parsed.name === "string" &&
      typeof parsed.targetAt === "number" &&
      Number.isFinite(parsed.targetAt)
    ) {
      const name = parsed.name.trim();
      if (!name) return null;
      return { name, targetAt: parsed.targetAt };
    }
  } catch {
    return null;
  }
  return null;
}

export function saveCountdownGoal(goal: CountdownGoal | null): void {
  if (!goal) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
}

export function getCountdownRemaining(targetAt: number, now = Date.now()): CountdownRemaining {
  const diff = Math.max(0, targetAt - now);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: targetAt <= now,
  };
}
