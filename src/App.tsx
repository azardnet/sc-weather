import { useState } from "react";

import Header from "./components/Header";
import NeonClock from "./components/NeonClock";
import { LoadingPortal, PortalModal, SettingsPortal } from "./components/Portals";
import ScriptClock from "./components/ScriptClock";
import SimpleModeClock from "./components/SimpleModeClock";
import { TooltipProvider } from "./components/ui/tooltip";
import WeatherSection from "./components/WeatherSection";
import { useWeatherApp } from "./hooks/useWeatherApp";
import { isOverlayClockTheme } from "./lib/clock-theme";
import { formatTemp } from "./lib/format";
import { cn } from "@/lib/utils";

export default function App() {
  const { mainVisible, clockTheme, header, weatherSection, portalModal, settings } =
    useWeatherApp();
  const [shell, setShell] = useState<HTMLDivElement | null>(null);

  const { weather, prices, clock, cityTitle } = weatherSection;
  const temperature = weather ? formatTemp(weather.temp, weather.isPersian) : "";
  const overlay = isOverlayClockTheme(clockTheme);
  const overlayProps = {
    date: clock.date,
    temperature,
    city: cityTitle,
    usdt: prices.usdt,
    gold: prices.gold,
    clock,
    onOpenSettings: header.onOpenSettings,
  };

  return (
    <TooltipProvider>
      <div ref={setShell} className="relative h-screen w-screen overflow-hidden">
        <main
          className={cn(
            "absolute inset-0 w-screen flex-col items-center",
            mainVisible && !overlay ? "flex" : "hidden",
          )}
        >
          <Header {...header} />
          <WeatherSection {...weatherSection} />
        </main>

        {clockTheme === "simple" ? <SimpleModeClock {...overlayProps} /> : null}
        {clockTheme === "neon" ? <NeonClock {...overlayProps} /> : null}
        {clockTheme === "script" ? <ScriptClock {...overlayProps} /> : null}

        <LoadingPortal />
        <PortalModal {...portalModal} container={shell} />
        <SettingsPortal {...settings} container={shell} />
      </div>
    </TooltipProvider>
  );
}
