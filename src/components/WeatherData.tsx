import type { MouseEventHandler } from "react";
import type { WeatherSnapshot } from "../lib/types";
import { NumbersToPersian } from "../lib/utils";
import { translate } from "../lib/translate";
import { formatTemp, formatHumidity, UNIT } from "../lib/format";
import { TO_FIXED } from "../lib/constants";
import { HumidityIcon } from "./Icons";

interface WeatherDataProps {
  weather: WeatherSnapshot | null;
  iconSrc: string | null;
  lastUpdateLabel: string;
  onLastUpdateHover: MouseEventHandler<HTMLSpanElement>;
}

export default function WeatherData({
  weather,
  iconSrc,
  lastUpdateLabel,
  onLastUpdateHover,
}: WeatherDataProps) {
  if (!weather) {
    return <div className="weather-data" />;
  }

  const lang = weather.isPersian ? "fa" : "en";

  return (
    <div className="weather-data">
      <div className="temp-feels-wrapper">
        <span className="temperature">
          <span className="value">
            {formatTemp(weather.temp, weather.isPersian)}
          </span>
          <span className="unit">{UNIT}</span>
          <span className="info" onMouseMove={onLastUpdateHover}>
            <span className="last-update">{lastUpdateLabel}</span>
          </span>
        </span>
        <span className="feels_like">
          <span className="text">{translate[lang].FeelsLike}</span>
          <span className="value-wrapper">
            <span className="value">
              {formatTemp(weather.feels, weather.isPersian)}
            </span>
            <span className="unit">{UNIT}</span>
            <span />
          </span>
        </span>
        <span className="wind-speed">
          <span className="text">{translate[lang].WindSpeed}</span>
          <span className="value">
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

      <div className="current-weather-icon">
        <div
          className="svg-icon"
          style={iconSrc ? { backgroundImage: `url("${iconSrc}")` } : undefined}
        />
        <span>{weather.description}</span>
      </div>

      <div className="weather-details-wrapper">
        <div className="min-max-wrapper">
          <span className="temp_max">
            <div>
              <span className="value">
                {formatTemp(weather.max, weather.isPersian)}
              </span>
              <span className="unit">{UNIT}</span>
            </div>
          </span>
          <span className="temp_min">
            <div>
              <span className="value">
                {formatTemp(weather.min, weather.isPersian)}
              </span>
              <span className="unit">{UNIT}</span>
            </div>
          </span>
        </div>
        <span className="humidity">
          <div>
            <div className="humidity-icon">
              <HumidityIcon />
              <div className="overlay-drop">
                <div className="water" />
              </div>
            </div>
            <span className="value">
              {formatHumidity(weather.humidity, weather.isPersian)}
            </span>
            <span className="unit">%</span>
          </div>
        </span>
      </div>
    </div>
  );
}
