import Header from "./components/Header";
import {
  LoadingPortal,
  PortalModal,
  SettingsPortal,
} from "./components/Portals";
import SimpleModeClock from "./components/SimpleModeClock";
import WeatherSection from "./components/WeatherSection";
import { formatTemp } from "./lib/format";
import { useWeatherApp } from "./hooks/useWeatherApp";

export default function App() {
  const {
    mainVisible,
    mainBlur,
    simpleMode,
    header,
    weatherSection,
    portalModal,
    settings,
  } = useWeatherApp();

  const { weather, prices, clock, cityTitle } = weatherSection;
  const temperature = weather
    ? formatTemp(weather.temp, weather.isPersian)
    : "";

  return (
    <>
      <main
        style={{
          display: mainVisible && !simpleMode ? "flex" : "none",
          filter: mainBlur ? "blur(20px)" : "blur(0px)",
        }}
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
      <PortalModal {...portalModal} />
      {!simpleMode ? <SettingsPortal {...settings} /> : null}
    </>
  );
}
