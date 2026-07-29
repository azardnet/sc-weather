import { useEffect, useState } from "react";

interface Hands {
  hour: number;
  minute: number;
  second: number;
}

export interface SimpleModeClockProps {
  date: string;
  temperature: string;
  city: string;
  usdt: string;
  gold: string;
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
    <div className="simple-mode">
      <div className="simple-mode__top">
        {city ? <p className="simple-mode__city">{city}</p> : null}
        {temperature ? (
          <p className="simple-mode__temp">
            {temperature}
            <span>°</span>
          </p>
        ) : null}
        <p className="simple-mode__date">{date.trim()}</p>
      </div>

      <div className="simple-mode__stage">
        <svg className="simple-mode__clock" viewBox="0 0 200 200" role="img" aria-hidden="true">
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

      <div className="simple-mode__meta">
        <div className="simple-mode__meta-item">
          <span className="simple-mode__meta-label">USDT</span>
          <span className="simple-mode__meta-value">{usdt}</span>
        </div>
        <span className="simple-mode__meta-sep" aria-hidden="true" />
        <div className="simple-mode__meta-item">
          <span className="simple-mode__meta-label">GOLD</span>
          <span className="simple-mode__meta-value">{gold}</span>
        </div>
      </div>
    </div>
  );
}
