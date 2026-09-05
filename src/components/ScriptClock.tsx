import type { OverlayClockProps } from "./ClockOverlay";
import { OverlayClockShell, OverlayPrices } from "./ClockOverlay";

export default function ScriptClock({
  date,
  temperature,
  city,
  usdt,
  gold,
  clock,
  onOpenSettings,
}: OverlayClockProps & { onOpenSettings: () => void }) {
  const [hours = "", minutes = ""] = clock.hour.split(":");

  return (
    <OverlayClockShell
      onOpenSettings={onOpenSettings}
      className="bg-[#16110c] text-[#f3e6d0] bg-[radial-gradient(120%_80%_at_50%_0%,rgba(243,230,208,0.08),transparent_55%)]"
    >
      <div className="flex flex-col items-center gap-3">
        {city ? (
          <p className="m-0 text-center font-ephesis text-[clamp(28px,4vw,52px)] leading-none tracking-[0.12em] text-[#f3e6d0]/70">
            {city}
          </p>
        ) : null}
        {temperature ? (
          <p className="m-0 text-[clamp(13px,1.5vw,18px)] tracking-[0.28em] text-[#f3e6d0]/35">
            {temperature}
            <span className="ms-px text-[0.85em]">°</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-center">
        <p
          className="m-0 font-ephesis text-[clamp(96px,22vw,280px)] leading-[0.8] text-[#f3e6d0] [direction:ltr] [text-shadow:0_12px_40px_rgba(0,0,0,0.35)]"
          aria-hidden="true"
        >
          {hours}
          <span className="mx-[0.04em] text-[#f3e6d0]/40">:</span>
          {minutes}
        </p>
        <p className="mt-6 text-[clamp(14px,1.7vw,20px)] tracking-[0.18em] text-[#f3e6d0]/42">
          {date.trim()}
          {clock.second ? (
            <span className="ms-3 tracking-[0.08em] text-[#f3e6d0]/28 [direction:ltr] tabular-nums">
              {clock.second.replace(/^:/, "")}
            </span>
          ) : null}
        </p>
      </div>

      <OverlayPrices usdt={usdt} gold={gold} />
    </OverlayClockShell>
  );
}
