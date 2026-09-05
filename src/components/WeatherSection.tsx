import type { CSSProperties, RefObject } from "react";

import type { ClockState, PricesState, WeatherSnapshot } from "../lib/types";
import type { SpeedSnapshot } from "../lib/utils";
import BottomOverlay from "./BottomOverlay";
import DigitalClock from "./DigitalClock";
import WeatherData from "./WeatherData";
import { cn } from "@/lib/utils";

interface WeatherSectionProps {
  opacity: number;
  backgroundImage: string | null;
  style: CSSProperties;
  showVideo: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc: string | null;
  mapRef: RefObject<HTMLDivElement | null>;
  speed: SpeedSnapshot;
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
  weatherIcon: string | null;
  lastUpdateLabel: string;
  onLastUpdateHover: () => void;
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
  speed,
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
  weatherIcon,
  lastUpdateLabel,
  onLastUpdateHover,
  clock,
}: WeatherSectionProps) {
  return (
    <section
      className="relative mt-2.5 mb-0 min-h-0 w-[80vw] flex-1 overflow-hidden bg-cover bg-center bg-no-repeat max-[750px]:w-[calc(90vw-2em)] max-[750px]:text-xs max-[450px]:w-[calc(95vw-1em)] max-[450px]:text-[10px]"
      style={{
        opacity,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        ...style,
      }}
    >
      <div className={cn("absolute inset-0 overflow-hidden", showVideo ? "block" : "hidden")}>
        <video
          ref={videoRef}
          className="h-full w-full max-w-none object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          {videoSrc ? <source src={videoSrc} type="video/mp4" /> : null}
        </video>
      </div>

      <div className="h-full w-full" ref={mapRef} />

      <BottomOverlay
        speed={speed}
        news={news}
        newsTransform={newsTransform}
        animationDuration={animationDuration}
        prices={prices}
      />

      <div
        className={cn(
          "absolute -top-px -left-px z-[1] m-auto flex h-[calc(100%+2px)] w-[calc(100%+2px)] items-baseline justify-center transition-colors duration-[250ms]",
          mapOverlayInterval && "bg-black/35",
        )}
      >
        <span
          className={cn(
            "absolute right-0 -bottom-[5px] -left-0.5 m-auto h-[35px] w-[calc(100%+4px)]",
            showMapOverlayBottom ? "flex" : "hidden",
          )}
          style={{ backgroundColor: color }}
        >
          <span
            className="absolute -bottom-[15px] h-10 w-full"
            style={{ backgroundColor: color }}
          />
        </span>
        <span
          className="absolute inset-0 -z-[1] m-auto h-[calc(100%+4px)] w-[calc(100%+4px)]"
          style={{
            backgroundColor: color,
            opacity: mapOpacity / 100,
          }}
        />
        <div className="mt-[25px] flex w-[90%] flex-col items-center">
          <h1 className="relative m-0">
            <span
              className="absolute -top-2.5 -right-[25px] size-[30px] bg-contain bg-center bg-no-repeat opacity-45 max-[750px]:-top-[5px] max-[750px]:-right-3 max-[750px]:size-5 rtl:right-auto rtl:-left-[25px]"
              style={flagSrc ? { backgroundImage: `url("${flagSrc}")` } : undefined}
            />
            <b className="flex font-ephesis text-[2.5em] tracking-[10px] whitespace-pre capitalize text-white/80 [text-shadow:3px_5px_0_rgba(255,255,255,0.1)] max-[750px]:text-[2em] light:text-black light:[text-shadow:3px_5px_0_rgba(0,0,0,0.2)] rtl:text-[4.5em] rtl:leading-[110px] rtl:tracking-[2px]">
              {cityTitle}
            </b>
          </h1>
          <WeatherData
            weather={weather}
            weatherIcon={weatherIcon}
            lastUpdateLabel={lastUpdateLabel}
            onLastUpdateHover={onLastUpdateHover}
          />
          <DigitalClock clock={clock} />
        </div>
      </div>
    </section>
  );
}
