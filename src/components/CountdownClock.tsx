import { useState } from "react";

import type { OverlayClockProps } from "./ClockOverlay";
import { OverlayClockShell, OverlayHeader, OverlayPrices } from "./ClockOverlay";
import MotivationalQuote from "./MotivationalQuote";
import { Button } from "@/components/ui/button";
import { useMotivationalQuote } from "@/hooks/useMotivationalQuote";
import {
  RiAddLine,
  RiCalendarLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "@/components/ui/icon";
import {
  type CountdownGoal,
  type CountdownRemaining,
  getCountdownRemaining,
  loadCountdownGoal,
  saveCountdownGoal,
} from "@/lib/countdown-goal";
import {
  dateFromJalali,
  isSameJalali,
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  type JalaliDate,
  jalaliFromDate,
  jalaliMonthLength,
  jalaliMonthStartWeekday,
  shiftJalaliMonth,
} from "@/lib/jalali";
import { cn, NumbersToPersian } from "@/lib/utils";

interface GoalDraft {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function faNum(value: number, digits = 2): string {
  return NumbersToPersian(value.toString().padStart(digits, "0"));
}

function clampDay(year: number, month: number, day: number): number {
  return Math.min(day, jalaliMonthLength(year, month));
}

function draftFromGoal(goal: CountdownGoal | null): GoalDraft {
  const base = goal ? new Date(goal.targetAt) : new Date();
  if (!goal) {
    base.setDate(base.getDate() + 7);
    base.setHours(0, 0, 0, 0);
  }
  const jalali = jalaliFromDate(base);
  return {
    name: goal?.name ?? "",
    year: jalali.year,
    month: jalali.month,
    day: jalali.day,
    hour: base.getHours(),
    minute: base.getMinutes(),
  };
}

function draftToGoal(draft: GoalDraft): CountdownGoal | null {
  const name = draft.name.trim();
  if (!name) return null;
  return {
    name,
    targetAt: dateFromJalali(
      draft.year,
      draft.month,
      clampDay(draft.year, draft.month, draft.day),
      draft.hour,
      draft.minute,
    ).getTime(),
  };
}

function formatTargetLabel(targetAt: number): string {
  return new Date(targetAt).toLocaleString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CountdownClock({
  date,
  temperature,
  city,
  usdt,
  gold,
  clock,
  onOpenSettings,
}: OverlayClockProps & { onOpenSettings: () => void }) {
  const [hours = "", minutes = ""] = clock.hour.split(":");
  const seconds = clock.second.replace(/^:/, "");
  const quote = useMotivationalQuote();
  const [goal, setGoal] = useState<CountdownGoal | null>(() => loadCountdownGoal());
  const [editing, setEditing] = useState(() => loadCountdownGoal() === null);
  const [draft, setDraft] = useState<GoalDraft>(() => draftFromGoal(loadCountdownGoal()));

  const remaining = goal ? getCountdownRemaining(goal.targetAt) : null;

  const today = jalaliFromDate(new Date());
  const selected: JalaliDate = {
    year: draft.year,
    month: draft.month,
    day: clampDay(draft.year, draft.month, draft.day),
  };

  function persistGoal(next: CountdownGoal | null) {
    saveCountdownGoal(next);
    setGoal(next);
    setDraft(draftFromGoal(next));
    setEditing(next === null);
  }

  function saveDraft() {
    const next = draftToGoal(draft);
    if (!next) return;
    persistGoal(next);
  }

  function startEditing() {
    setDraft(draftFromGoal(goal));
    setEditing(true);
  }

  function shiftMonth(delta: number) {
    setDraft((current) => {
      const next = shiftJalaliMonth(current.year, current.month, delta);
      return {
        ...current,
        year: next.year,
        month: next.month,
        day: clampDay(next.year, next.month, current.day),
      };
    });
  }

  function shiftYear(delta: number) {
    setDraft((current) => ({
      ...current,
      year: current.year + delta,
      day: clampDay(current.year + delta, current.month, current.day),
    }));
  }

  function stepTime(field: "hour" | "minute", delta: number) {
    setDraft((current) => {
      const max = field === "hour" ? 24 : 60;
      const nextValue = (current[field] + delta + max) % max;
      return { ...current, [field]: nextValue };
    });
  }

  const monthLength = jalaliMonthLength(draft.year, draft.month);
  const startWeekday = jalaliMonthStartWeekday(draft.year, draft.month);
  const cells = [
    ...Array.from({ length: startWeekday }, (_, index) => ({ key: `pad-${index}`, day: null })),
    ...Array.from({ length: monthLength }, (_, index) => ({
      key: `day-${draft.year}-${draft.month}-${index + 1}`,
      day: index + 1,
    })),
  ];

  return (
    <OverlayClockShell
      onOpenSettings={onOpenSettings}
      className="bg-[#05070b] text-zinc-100 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(251,191,36,0.08),transparent_58%)]"
    >
      <OverlayHeader city={city} temperature={temperature} date={date} />

      <div
        className="flex max-h-[68vh] w-full max-w-[1680px] flex-col items-center justify-center gap-[clamp(20px,3vw,56px)] overflow-y-auto lg:flex-row"
        dir="ltr"
      >
        <div className="flex flex-col items-center">
          <div
            className="flex items-end gap-[0.08em] font-sans text-[clamp(52px,10vw,148px)] leading-none font-light tracking-[0.04em] text-white tabular-nums [direction:ltr]"
            aria-hidden="true"
          >
            <span>{hours}</span>
            <span className="animate-pulse px-[0.02em] text-white/35">:</span>
            <span>{minutes}</span>
            <span className="ms-[0.18em] self-end pb-[0.14em] text-[0.28em] tracking-[0.16em] text-white/45">
              {seconds}
            </span>
          </div>
          {clock.midday ? (
            <p className="mt-4 text-[clamp(12px,1.4vw,16px)] tracking-[0.42em] text-white/28">
              {clock.midday}
            </p>
          ) : null}
        </div>

        <div className="hidden h-[min(42vh,280px)] w-px bg-white/10 lg:block" aria-hidden="true" />

        <div className="w-full max-w-[520px]" dir="rtl">
          {editing ? (
            <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/4 p-4 backdrop-blur-sm">
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveDraft();
                }}
                placeholder="نام هدف"
                autoComplete="off"
                inputMode="none"
                className="h-12 w-full border-0 border-b border-white/15 bg-transparent px-1 text-center text-[clamp(22px,2.6vw,34px)] text-white outline-none placeholder:text-white/25"
              />

              <div className="flex items-center justify-between gap-2 text-white/80">
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-white/55 hover:bg-white/10 hover:text-white"
                    onClick={() => shiftYear(-1)}
                    aria-label="سال قبل"
                  >
                    »
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-white/55 hover:bg-white/10 hover:text-white"
                    onClick={() => shiftMonth(-1)}
                    aria-label="ماه قبل"
                  >
                    ›
                  </Button>
                </div>
                <p className="m-0 text-[clamp(16px,1.8vw,20px)] font-medium tracking-wide">
                  {JALALI_MONTHS[draft.month - 1]} {faNum(draft.year, 4)}
                </p>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-white/55 hover:bg-white/10 hover:text-white"
                    onClick={() => shiftMonth(1)}
                    aria-label="ماه بعد"
                  >
                    ‹
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-white/55 hover:bg-white/10 hover:text-white"
                    onClick={() => shiftYear(1)}
                    aria-label="سال بعد"
                  >
                    «
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {JALALI_WEEKDAYS.map((weekday) => (
                  <span key={weekday} className="py-1 text-[12px] text-white/30">
                    {weekday}
                  </span>
                ))}
                {cells.map((cell) => {
                  if (cell.day == null) {
                    return <span key={cell.key} />;
                  }
                  const day = cell.day;
                  const cellDate: JalaliDate = {
                    year: draft.year,
                    month: draft.month,
                    day,
                  };
                  const isSelected = isSameJalali(cellDate, selected);
                  const isToday = isSameJalali(cellDate, today);
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      onClick={() => setDraft((current) => ({ ...current, day }))}
                      className={cn(
                        "flex size-9 items-center justify-center justify-self-center rounded-full text-[14px] transition-colors",
                        isSelected
                          ? "bg-amber-300 text-black"
                          : isToday
                            ? "text-amber-200 ring-1 ring-amber-300/50"
                            : "text-white/75 hover:bg-white/10",
                      )}
                    >
                      {faNum(day, 1)}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TimeStepper
                  label="ساعت"
                  value={draft.hour}
                  onDecrease={() => stepTime("hour", -1)}
                  onIncrease={() => stepTime("hour", 1)}
                />
                <TimeStepper
                  label="دقیقه"
                  value={draft.minute}
                  onDecrease={() => stepTime("minute", -1)}
                  onIncrease={() => stepTime("minute", 1)}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                {goal ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-white/45 hover:bg-white/10 hover:text-white"
                    onClick={() => persistGoal(null)}
                  >
                    <RiDeleteBinLine />
                    حذف
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  {goal ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white/55 hover:bg-white/10 hover:text-white"
                      onClick={() => {
                        setDraft(draftFromGoal(goal));
                        setEditing(false);
                      }}
                    >
                      انصراف
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    disabled={!draft.name.trim()}
                    className="bg-amber-300 text-black hover:bg-amber-200 disabled:opacity-40"
                    onClick={saveDraft}
                  >
                    <RiCheckLine />
                    ذخیره
                  </Button>
                </div>
              </div>
            </div>
          ) : goal && remaining ? (
            <button
              type="button"
              onClick={startEditing}
              className="flex w-full flex-col items-center gap-4 rounded-[28px] border border-white/8 bg-white/4 px-6 py-7 text-center transition-colors hover:border-white/16 hover:bg-white/6"
            >
              <span className="flex items-center gap-2 text-[13px] tracking-[0.18em] text-amber-200/55">
                <RiPencilLine className="size-3.5" />
                هدف
              </span>
              <span className="max-w-full break-words text-[clamp(28px,3.4vw,44px)] leading-tight font-medium text-white">
                {goal.name}
              </span>
              {remaining.expired ? (
                <span className="rounded-full bg-amber-300/15 px-4 py-1.5 text-[clamp(14px,1.6vw,18px)] text-amber-200">
                  زمان این هدف رسید
                </span>
              ) : (
                <CountdownUnits remaining={remaining} />
              )}
              <span className="flex items-center gap-2 text-[clamp(12px,1.3vw,15px)] text-white/35">
                <RiCalendarLine className="size-3.5" />
                {formatTargetLabel(goal.targetAt)}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="flex min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-white/15 bg-white/3 px-6 py-8 text-white/45 hover:border-white/25 hover:text-white/70"
            >
              <RiAddLine className="size-8" />
              <span className="text-[clamp(16px,1.8vw,20px)]">یک هدف و تاریخ شمسی انتخاب کنید</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-[clamp(16px,2.4vh,32px)]">
        <MotivationalQuote quote={quote} />
        <OverlayPrices usdt={usdt} gold={gold} />
      </div>
    </OverlayClockShell>
  );
}

function TimeStepper({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 overflow-visible rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
      <span className="text-[12px] text-white/35">{label}</span>
      <div className="flex items-center gap-3" dir="ltr">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-white/55 hover:bg-white/10 hover:text-white"
          onClick={onDecrease}
          aria-label={`${label} کمتر`}
        >
          −
        </Button>
        <span className="flex h-8 min-w-[2.8ch] items-center justify-center text-[22px] font-medium tabular-nums text-white">
          {value.toString().padStart(2, "0")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-white/55 hover:bg-white/10 hover:text-white"
          onClick={onIncrease}
          aria-label={`${label} بیشتر`}
        >
          +
        </Button>
      </div>
    </div>
  );
}

const COUNTDOWN_UNITS = [
  { key: "days", label: "روز", separator: "/", wide: true },
  { key: "hours", label: "ساعت", separator: ":" },
  { key: "minutes", label: "دقیقه", separator: ":" },
  { key: "seconds", label: "ثانیه", separator: ":" },
] as const;

function visibleCountdownUnits(remaining: CountdownRemaining) {
  const start = COUNTDOWN_UNITS.findIndex(
    (unit) => unit.key === "seconds" || remaining[unit.key] > 0,
  );
  return COUNTDOWN_UNITS.slice(start);
}

function CountdownUnits({ remaining }: { remaining: CountdownRemaining }) {
  const units = visibleCountdownUnits(remaining);

  return (
    <span className="flex items-end justify-center gap-4" dir="ltr">
      {units.map((unit, index) => (
        <span key={unit.key} className="contents">
          {index > 0 ? (
            <span
              className={cn(
                "mb-[1.35em] text-[clamp(20px,2vw,28px)]",
                units[index - 1].separator === "/" ? "text-white/20" : "text-amber-200/35",
              )}
            >
              {units[index - 1].separator}
            </span>
          ) : null}
          <CountdownUnit
            value={remaining[unit.key]}
            label={unit.label}
            wide={"wide" in unit && unit.wide}
          />
        </span>
      ))}
    </span>
  );
}

function CountdownUnit({
  value,
  label,
  wide = false,
}: {
  value: number;
  label: string;
  wide?: boolean;
}) {
  return (
    <span className="flex min-w-[3.6em] flex-col items-center gap-1.5">
      <span
        className={cn(
          "font-light tabular-nums text-amber-200 [text-shadow:0_0_24px_rgba(251,191,36,0.28)]",
          wide ? "text-[clamp(36px,4.4vw,64px)]" : "text-[clamp(32px,3.8vw,56px)]",
        )}
      >
        {faNum(value, value >= 100 ? 3 : 2)}
      </span>
      <span className="text-[11px] tracking-[0.18em] text-white/30">{label}</span>
    </span>
  );
}
