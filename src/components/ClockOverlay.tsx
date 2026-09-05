import type { ReactNode } from "react";

import type { ClockState } from "../lib/types";
import { Button } from "@/components/ui/button";
import { RiLoader4Line, RiSettings3Line } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface OverlayClockProps {
  date: string;
  temperature: string;
  city: string;
  usdt: string | null;
  gold: string | null;
  clock: ClockState;
}

export function OverlaySettingsButton({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-settings-trigger
      className="absolute top-4 right-4 z-10 text-white/35 hover:bg-white/10 hover:text-white rtl:right-auto rtl:left-4"
      onClick={onOpenSettings}
    >
      <RiSettings3Line />
      <span className="sr-only">Settings</span>
    </Button>
  );
}

export function OverlayClockShell({
  children,
  onOpenSettings,
  className,
}: {
  children: ReactNode;
  onOpenSettings: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-30 grid grid-rows-[auto_1fr_auto] items-center justify-items-center bg-black px-[6vw] py-[7vh] pb-[6vh] font-sans text-white",
        className,
      )}
    >
      <OverlaySettingsButton onOpenSettings={onOpenSettings} />
      {children}
    </div>
  );
}

export function OverlayPrices({ usdt, gold }: { usdt: string | null; gold: string | null }) {
  return (
    <div className="flex items-center gap-[clamp(18px,4vw,40px)]">
      <PriceBlock label="USDT" value={usdt} />
      <span className="h-7 w-px bg-white/12" aria-hidden="true" />
      <PriceBlock label="GOLD" value={gold} />
    </div>
  );
}

function PriceBlock({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex min-w-[88px] flex-col items-center gap-1.5">
      <span className="text-[10px] tracking-[0.22em] text-white/28">{label}</span>
      <span className="flex min-h-[1.2em] items-center text-[clamp(14px,1.8vw,18px)] font-normal tracking-[0.04em] text-white/72 tabular-nums">
        {value == null ? <RiLoader4Line size={16} className="animate-spin" /> : value}
      </span>
    </div>
  );
}

export function OverlayHeader({
  city,
  temperature,
  date,
}: {
  city: string;
  temperature: string;
  date: string;
}) {
  return (
    <div className="flex items-baseline justify-center gap-[1.25em]">
      {city ? <p className={metaText}>{city}</p> : null}
      {temperature ? (
        <p className={metaText}>
          {temperature}
          <span className="ms-px text-[0.85em] opacity-75">°</span>
        </p>
      ) : null}
      <p className={metaText}>{date.trim()}</p>
    </div>
  );
}

const metaText =
  "m-0 text-center text-[clamp(13px,1.6vw,18px)] font-normal leading-none tracking-[0.08em] text-white/38";
