import { useEffect, useState } from "react";

import { RiLoader4Line } from "@/components/ui/icon";

interface Hands {
  hour: number;
  minute: number;
  second: number;
}

export interface SimpleModeClockProps {
  date: string;
  temperature: string;
  city: string;
  usdt: string | null;
  gold: string | null;
}

function getHands(now: Date): Hands {
  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms / 1000;
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;
  return {
    hour: h * 30,
    minute: m * 6,
    second: s * 6,
  };
}

const metaText =
  "m-0 text-center text-[clamp(13px,1.6vw,18px)] font-normal leading-none tracking-[0.08em] text-white/38";

export default function SimpleModeClock({
  date,
  temperature,
  city,
  usdt,
  gold,
}: SimpleModeClockProps) {
  const [hands, setHands] = useState(() => getHands(new Date()));

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setHands(getHands(new Date()));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] grid grid-rows-[auto_1fr_auto] items-center justify-items-center bg-black px-[6vw] py-[7vh] pb-[6vh] font-sans text-white">
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

      <div className="flex flex-col items-center">
        <svg
          className="h-[min(78vmin,720px)] w-[min(78vmin,720px)] overflow-visible"
          viewBox="0 0 200 200"
          role="img"
          aria-hidden="true"
        >
          <line
            x1="100"
            y1="12"
            x2="100"
            y2="28"
            stroke="#8a8a8a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="172"
            y1="100"
            x2="188"
            y2="100"
            stroke="#8a8a8a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="172"
            x2="100"
            y2="188"
            stroke="#8a8a8a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="100"
            x2="28"
            y2="100"
            stroke="#8a8a8a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <g transform={`rotate(${hands.hour} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="48"
              stroke="#f2f2f2"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
          <g transform={`rotate(${hands.minute} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g transform={`rotate(${hands.second} 100 100)`}>
            <line
              x1="100"
              y1="112"
              x2="100"
              y2="24"
              stroke="#e10600"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <circle cx="100" cy="100" r="4" fill="#e10600" />
        </svg>
      </div>

      <div className="flex items-center gap-[clamp(18px,4vw,40px)]">
        <div className="flex min-w-[88px] flex-col items-center gap-1.5">
          <span className="text-[10px] tracking-[0.22em] text-white/28">USDT</span>
          <span className="flex min-h-[1.2em] items-center text-[clamp(14px,1.8vw,18px)] font-normal tracking-[0.04em] text-white/72 tabular-nums">
            {usdt == null ? <RiLoader4Line size={16} className="animate-spin" /> : usdt}
          </span>
        </div>
        <span className="h-7 w-px bg-white/12" aria-hidden="true" />
        <div className="flex min-w-[88px] flex-col items-center gap-1.5">
          <span className="text-[10px] tracking-[0.22em] text-white/28">GOLD</span>
          <span className="flex min-h-[1.2em] items-center text-[clamp(14px,1.8vw,18px)] font-normal tracking-[0.04em] text-white/72 tabular-nums">
            {gold == null ? <RiLoader4Line size={16} className="animate-spin" /> : gold}
          </span>
        </div>
      </div>
    </div>
  );
}
