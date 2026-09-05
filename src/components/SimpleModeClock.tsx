import { useEffect, useState } from "react";

import type { OverlayClockProps } from "./ClockOverlay";
import { OverlayClockShell, OverlayHeader, OverlayPrices } from "./ClockOverlay";

interface Hands {
  hour: number;
  minute: number;
  second: number;
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

export default function SimpleModeClock({
  date,
  temperature,
  city,
  usdt,
  gold,
  onOpenSettings,
}: OverlayClockProps & { onOpenSettings: () => void }) {
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
    <OverlayClockShell onOpenSettings={onOpenSettings}>
      <OverlayHeader city={city} temperature={temperature} date={date} />

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

      <OverlayPrices usdt={usdt} gold={gold} />
    </OverlayClockShell>
  );
}
