import type { PricesState } from "../lib/types";
import type { SpeedSnapshot } from "../lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  RiBitCoinLine,
  RiCoinLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiWifiLine,
} from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface BottomOverlayProps {
  speed: SpeedSnapshot;
  news: string;
  animationDuration: number;
  prices: PricesState;
}

function SpeedIcon({ status }: { status: SpeedSnapshot["status"] }) {
  if (status === "loading") {
    return (
      <RiLoader4Line size={32} className="animate-spin max-[750px]:size-6 max-[450px]:size-5" />
    );
  }
  if (status === "loaded") {
    return <RiWifiLine size={32} className="max-[750px]:size-6 max-[450px]:size-5" />;
  }
  return <RiErrorWarningLine size={32} className="max-[750px]:size-6 max-[450px]:size-5" />;
}

const priceClass =
  "relative h-8 min-h-8 justify-start gap-1 rounded-none bg-transparent p-0 font-sans text-[18px] font-semibold text-white [direction:ltr] [&>svg]:size-[18px] max-[750px]:text-sm max-[750px]:[&>svg]:size-4 max-[450px]:text-xs max-[450px]:[&>svg]:size-3";

function PriceValue({ value, unit }: { value: string | null; unit: string }) {
  if (value == null) {
    return <RiLoader4Line size={18} className="animate-spin opacity-80" />;
  }
  return (
    <>
      <span className="text-[18px] font-semibold leading-none [direction:ltr] max-[750px]:text-sm max-[450px]:text-xs">
        {value}
      </span>
      <span className="text-[18px] font-semibold leading-none [direction:ltr] max-[750px]:text-sm max-[450px]:text-xs">
        {unit}
      </span>
    </>
  );
}

export default function BottomOverlay({
  speed,
  news,
  animationDuration,
  prices,
}: BottomOverlayProps) {
  return (
    <div className="absolute -bottom-0.5 -left-0.5 z-[2] m-auto box-border flex h-[115px] w-[calc(100%+4px)] items-center gap-3 bg-black/19 px-8 py-2 text-[0.75em] text-white max-[750px]:px-3">
      <span
        className={cn(
          "relative flex shrink-0 items-center gap-1.5 font-sans text-[20px] text-white transition-colors duration-[250ms] max-[750px]:text-base max-[450px]:text-sm",
          speed.trend === "top" && "text-green-500/35",
          speed.trend === "down" && "text-red-500/75",
        )}
      >
        <SpeedIcon status={speed.status} />
        {speed.text}
      </span>
      <div className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden max-[750px]:absolute max-[750px]:-top-[42px] max-[750px]:right-0 max-[750px]:left-0 max-[750px]:w-full">
        {news ? (
          <span
            className="news-marquee inline-flex font-sans text-[20px] leading-none font-bold text-white max-[750px]:text-base max-[450px]:text-sm"
            style={{ animationDuration: `${animationDuration}s` }}
          >
            <span className="shrink-0 whitespace-nowrap px-8 [direction:rtl]">{news}</span>
            <span className="shrink-0 whitespace-nowrap px-8 [direction:rtl]" aria-hidden>
              {news}
            </span>
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-start max-[750px]:absolute max-[750px]:right-3 max-[750px]:bottom-2">
        <Badge variant="ghost" className={priceClass}>
          <RiBitCoinLine size={14} />
          <span className="m-0 text-[18px] font-semibold leading-none text-white max-[750px]:text-sm max-[450px]:text-xs">
            BTC:
          </span>
          <PriceValue value={prices.btc} unit="$" />
        </Badge>
        <Badge variant="ghost" className={priceClass}>
          <RiMoneyDollarCircleLine size={14} />
          <span className="m-0 text-[18px] font-semibold leading-none text-white max-[750px]:text-sm max-[450px]:text-xs">
            USDT:
          </span>
          <PriceValue value={prices.usdt} unit="T" />
        </Badge>
        <Badge variant="ghost" className={priceClass}>
          <RiCoinLine size={14} />
          <span className="m-0 text-[18px] font-semibold leading-none text-white max-[750px]:text-sm max-[450px]:text-xs">
            GOLD:
          </span>
          <PriceValue value={prices.gold} unit="T" />
        </Badge>
      </div>
    </div>
  );
}
