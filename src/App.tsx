import { useState } from "react";

import Header from "./components/Header";
import { LoadingPortal, PortalModal, SettingsPortal } from "./components/Portals";
import SimpleModeClock from "./components/SimpleModeClock";
import { TooltipProvider } from "./components/ui/tooltip";
import WeatherSection from "./components/WeatherSection";
import { useWeatherApp } from "./hooks/useWeatherApp";
import { formatTemp } from "./lib/format";
import { cn } from "@/lib/utils";

export default function App() {
  const { mainVisible, simpleMode, header, weatherSection, portalModal, settings } =
    useWeatherApp();
  const [shell, setShell] = useState<HTMLDivElement | null>(null);

  const { weather, prices, clock, cityTitle } = weatherSection;
  const temperature = weather ? formatTemp(weather.temp, weather.isPersian) : "";

  return (
    <TooltipProvider>
      <div ref={setShell} className="relative h-screen w-screen overflow-hidden">
        <main
          className={cn(
            "absolute inset-0 w-screen flex-col items-center",
            mainVisible && !simpleMode ? "flex" : "hidden",
          )}
        >
          <Header {...header} />
          <WeatherSection {...weatherSection} />
        </main>

        {simpleMode ? (
          <SimpleModeClock
            date={clock.date}
            temperature={temperature}
            city={cityTitle}
            usdt={prices.usdt}
            gold={prices.gold}
          />
        ) : null}

        <LoadingPortal />
        <PortalModal {...portalModal} container={shell} />
        {!simpleMode ? <SettingsPortal {...settings} container={shell} /> : null}
      </div>
    </TooltipProvider>
  );
}
