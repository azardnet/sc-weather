import Header from "./components/Header";
import WeatherSection from "./components/WeatherSection";
import {
  LoadingPortal,
  PortalModal,
  SettingsPortal,
} from "./components/Portals";
import { useWeatherApp } from "./hooks/useWeatherApp";

export default function App() {
  const {
    mainVisible,
    mainBlur,
    header,
    weatherSection,
    portalModal,
    settings,
  } = useWeatherApp();

  return (
    <>
      <main
        style={{
          display: mainVisible ? "flex" : "none",
          filter: mainBlur ? "blur(20px)" : "blur(0px)",
        }}
      >
        <Header {...header} />
        <WeatherSection {...weatherSection} />
      </main>

      <LoadingPortal />
      <PortalModal {...portalModal} />
      <SettingsPortal {...settings} />
    </>
  );
}
