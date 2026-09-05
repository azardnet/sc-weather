import type { OverlayClockProps } from "./ClockOverlay";
import { OverlayClockShell, OverlayHeader, OverlayPrices } from "./ClockOverlay";

function DigitBlock({ value }: { value: string }) {
  return (
    <span className="inline-flex min-w-[1.15em] justify-center rounded-[0.12em] bg-cyan-300/8 px-[0.06em] [text-shadow:0_0_18px_rgba(103,232,249,0.55),0_0_64px_rgba(34,211,238,0.25)]">
      {value}
    </span>
  );
}

export default function NeonClock({
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

  return (
    <OverlayClockShell onOpenSettings={onOpenSettings} className="bg-[#03080c] text-cyan-100">
      <OverlayHeader city={city} temperature={temperature} date={date} />

      <div className="flex flex-col items-center">
        <div
          className="flex items-center gap-[0.12em] font-sans text-[clamp(52px,14vw,180px)] leading-none font-light tracking-[0.06em] text-cyan-300 tabular-nums [direction:ltr]"
          aria-hidden="true"
        >
          <DigitBlock value={hours} />
          <span className="animate-pulse px-[0.02em] text-cyan-300/80">:</span>
          <DigitBlock value={minutes} />
          <span className="ms-[0.22em] self-end pb-[0.12em] text-[0.32em] tracking-[0.14em] text-cyan-200/70">
            {seconds}
          </span>
        </div>
        {clock.midday ? (
          <p className="mt-4 text-[clamp(12px,1.4vw,16px)] tracking-[0.42em] text-cyan-200/40">
            {clock.midday}
          </p>
        ) : null}
      </div>

      <OverlayPrices usdt={usdt} gold={gold} />
    </OverlayClockShell>
  );
}
