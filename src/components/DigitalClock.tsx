import type { ClockState } from "../lib/types";

interface DigitalClockProps {
  clock: ClockState;
}

export default function DigitalClock({ clock }: DigitalClockProps) {
  return (
    <div className="absolute top-[46%] left-1/2 -translate-x-[40%] translate-y-[3vh] rtl:top-[55%] rtl:-translate-x-1/2">
      <div>
        <div className="relative flex w-[4.25em] text-[5em] text-white [text-shadow:3px_5px_0_rgba(255,255,255,0.1)] light:text-black light:[text-shadow:3px_5px_0_rgba(0,0,0,0.2)] rtl:w-[3.75em] rtl:text-[5.5em] rtl:[direction:ltr]">
          <div className="flex font-sans">
            <span id="time">{clock.hour}</span>
            <span id="sec">{clock.second}</span>
          </div>
          <span className="absolute top-[-0.5em] left-0 w-full text-center font-sans text-[0.125em]">
            {clock.midday}
          </span>
        </div>
        <div className="-mt-[15px] w-full text-center font-sans text-[19px] text-white">
          {clock.date}
        </div>
      </div>
    </div>
  );
}
