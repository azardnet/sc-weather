import type { CSSProperties, MouseEventHandler, RefObject } from "react";
import type { ClockState, PricesState, WeatherSnapshot } from "../lib/types";
import BottomOverlay from "./BottomOverlay";
import WeatherData from "./WeatherData";
import DigitalClock from "./DigitalClock";

interface WeatherSectionProps {
  opacity: number;
  backgroundImage: string | null;
  style: CSSProperties;
  showVideo: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc: string | null;
  mapRef: RefObject<HTMLDivElement | null>;
  speedRef: RefObject<HTMLSpanElement | null>;
  news: string;
  newsTransform: string;
  animationDuration: number;
  prices: PricesState;
  mapOverlayInterval: boolean;
  color: string;
  showMapOverlayBottom: boolean;
  mapOpacity: number;
  flagSrc: string | null;
  cityTitle: string;
  weather: WeatherSnapshot | null;
  iconSrc: string | null;
  lastUpdateLabel: string;
  onLastUpdateHover: MouseEventHandler<HTMLSpanElement>;
  clock: ClockState;
}

export default function WeatherSection({
  opacity,
  backgroundImage,
  style,
  showVideo,
  videoRef,
  videoSrc,
  mapRef,
  speedRef,
  news,
  newsTransform,
  animationDuration,
  prices,
  mapOverlayInterval,
  color,
  showMapOverlayBottom,
  mapOpacity,
  flagSrc,
  cityTitle,
  weather,
  iconSrc,
  lastUpdateLabel,
  onLastUpdateHover,
  clock,
}: WeatherSectionProps) {
  return (
    <section
      className="weather"
      style={{
        opacity,
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        ...style,
      }}
    >
      <div id="video" style={{ display: showVideo ? "block" : "none" }}>
        <video ref={videoRef} width="2000" height="2000" autoPlay muted loop>
          {videoSrc ? <source src={videoSrc} type="video/mp4" /> : null}
        </video>
      </div>

      <div id="map" ref={mapRef} />

      <BottomOverlay
        speedRef={speedRef}
        news={news}
        newsTransform={newsTransform}
        animationDuration={animationDuration}
        prices={prices}
      />

      <div className={`map-overlay${mapOverlayInterval ? " interval" : ""}`}>
        <span
          className="bottom"
          style={{
            backgroundColor: color,
            display: showMapOverlayBottom ? "flex" : "none",
          }}
        />
        <span
          className="cover"
          style={{
            backgroundColor: color,
            opacity: mapOpacity / 100,
          }}
        />
        <div className="content-wrapper">
          <h1>
            <span
              style={
                flagSrc ? { backgroundImage: `url("${flagSrc}")` } : undefined
              }
            />
            <b>{cityTitle}</b>
          </h1>
          <WeatherData
            weather={weather}
            iconSrc={iconSrc}
            lastUpdateLabel={lastUpdateLabel}
            onLastUpdateHover={onLastUpdateHover}
          />
          <DigitalClock clock={clock} />
        </div>
      </div>
    </section>
  );
}
