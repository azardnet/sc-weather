import type { ReactNode } from "react";

import { TO_FIXED, UNIT } from "../lib/constants";
import { formatHumidity, formatTemp } from "../lib/format";
import { translate } from "../lib/translate";
import type { WeatherSnapshot } from "../lib/types";
import { NumbersToPersian } from "../lib/utils";
import { Button } from "@/components/ui/button";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDropLine,
  RiInformationLine,
} from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WeatherIcon } from "@/components/ui/weather-icon";

interface WeatherDataProps {
  weather: WeatherSnapshot | null;
  weatherIcon: string | null;
  lastUpdateLabel: string;
  onLastUpdateHover: () => void;
}

function TempValue({
  value,
  isPersian,
  unitClass,
}: {
  value: number;
  isPersian: boolean;
  unitClass: string;
}) {
  return (
    <span className="inline-block [direction:ltr]">
      {formatTemp(value, isPersian)}
      <span className={unitClass}>{UNIT}</span>
    </span>
  );
}

function StatRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="grid h-[30px] grid-cols-[22px_auto] items-center gap-x-1 [direction:ltr]">
      <span className="flex size-[22px] items-center justify-center opacity-75">{icon}</span>
      <span className="whitespace-nowrap text-start leading-none">{children}</span>
    </div>
  );
}

export default function WeatherData({
  weather,
  weatherIcon,
  lastUpdateLabel,
  onLastUpdateHover,
}: WeatherDataProps) {
  if (!weather) {
    return (
      <div className="absolute top-10 right-0 left-0 m-auto flex w-[90%] flex-row items-center justify-between font-sans text-white" />
    );
  }

  const lang = weather.isPersian ? "fa" : "en";
  const unitSm = "relative -top-1.5 text-[55%]";

  return (
    <div className="absolute top-10 right-0 left-0 m-auto flex w-[90%] flex-row items-start justify-between font-sans text-white light:text-black">
      <div className="relative flex flex-col items-start">
        <span className="relative text-[2.575em] leading-9">
          <span className="inline-block [direction:ltr]">
            {formatTemp(weather.temp, weather.isPersian)}
          </span>
          <span className="relative -top-[15px] text-[40%]">{UNIT}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute -top-[25px] rtl:-top-[22px] rtl:-left-[30px]"
                onMouseEnter={onLastUpdateHover}
              >
                <RiInformationLine size={22} />
                <span className="sr-only">{lastUpdateLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{lastUpdateLabel}</TooltipContent>
          </Tooltip>
        </span>
        <span className="mt-0 mb-[5px]">
          <span>{translate[lang].FeelsLike}</span>
          <span className="mx-[3px] inline-block">
            <TempValue value={weather.feels} isPersian={weather.isPersian} unitClass={unitSm} />
          </span>
        </span>
        <span>
          <span>{translate[lang].WindSpeed}</span>
          <span className="inline-block rtl:[direction:rtl]">
            {weather.isPersian ? (
              <>
                {NumbersToPersian(weather.wind.toFixed(TO_FIXED))}{" "}
                <span>{translate.fa.WindSpeedUnit}</span>
              </>
            ) : (
              `${weather.wind.toFixed(TO_FIXED)} ${translate.en.WindSpeedUnit}`
            )}
          </span>
        </span>
      </div>

      <div className="relative flex min-w-[14em] flex-col items-end pt-1">
        <div className="mb-1 flex h-[30px] items-center gap-1.5">
          <WeatherIcon code={weatherIcon} size={28} className="size-7 shrink-0" />
          <span className="truncate capitalize leading-none">{weather.description}</span>
        </div>
        <div className="flex items-center gap-3">
          <StatRow icon={<RiArrowUpSLine size={22} />}>
            <TempValue value={weather.max} isPersian={weather.isPersian} unitClass={unitSm} />
          </StatRow>
          <StatRow icon={<RiArrowDownSLine size={22} />}>
            <TempValue value={weather.min} isPersian={weather.isPersian} unitClass={unitSm} />
          </StatRow>
        </div>
        <StatRow icon={<RiDropLine size={22} />}>
          <span className="inline-block [direction:ltr]">
            {formatHumidity(weather.humidity, weather.isPersian)}
            <span className="relative top-0 text-[55%]">%</span>
          </span>
        </StatRow>
      </div>
    </div>
  );
}
