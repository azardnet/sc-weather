import {
  type RemixiconComponentType,
  RiCloudLine,
  RiCloudyLine,
  RiMistLine,
  RiMoonClearLine,
  RiMoonCloudyLine,
  RiRainyLine,
  RiShowersLine,
  RiSnowyLine,
  RiSunCloudyLine,
  RiSunLine,
  RiThunderstormsLine,
} from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const WEATHER_ICONS: Record<string, RemixiconComponentType> = {
  "01d": RiSunLine,
  "01n": RiMoonClearLine,
  "02d": RiSunCloudyLine,
  "02n": RiMoonCloudyLine,
  "03d": RiCloudyLine,
  "03n": RiCloudyLine,
  "04d": RiCloudLine,
  "04n": RiCloudLine,
  "09d": RiShowersLine,
  "09n": RiShowersLine,
  "10d": RiRainyLine,
  "10n": RiRainyLine,
  "11d": RiThunderstormsLine,
  "11n": RiThunderstormsLine,
  "13d": RiSnowyLine,
  "13n": RiSnowyLine,
  "50d": RiMistLine,
  "50n": RiMistLine,
};

interface WeatherIconProps {
  code: string | null;
  className?: string;
  size?: number;
}

export function WeatherIcon({ code, className, size = 48 }: WeatherIconProps) {
  if (!code) return null;
  const Icon = WEATHER_ICONS[code] ?? RiCloudyLine;
  return <Icon size={size} className={cn("shrink-0", className)} />;
}
