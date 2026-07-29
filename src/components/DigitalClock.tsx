import type { ClockState } from "../lib/types";

interface DigitalClockProps {
  clock: ClockState;
}

export default function DigitalClock({ clock }: DigitalClockProps) {
  return (
    <div className="digital-clock">
      <div className="wrapper">
        <div className="time-wrapper">
          <div>
            <span className="hour" id="time">
              {clock.hour}
            </span>
            <span className="second" id="sec">
              {clock.second}
            </span>
          </div>
          <span className="minutes" id="med">
            {clock.midday}
          </span>
        </div>
        <div className="date-wrapper">{clock.date}</div>
      </div>
    </div>
  );
}
