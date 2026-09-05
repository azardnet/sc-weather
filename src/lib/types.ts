export type Lang = "fa" | "en";

export interface WeatherSnapshot {
  temp: number;
  feels: number;
  wind: number;
  description: string;
  max: number;
  min: number;
  humidity: number;
  isPersian: boolean;
}

export interface ClockState {
  hour: string;
  second: string;
  midday: string;
  date: string;
}

export interface PricesState {
  usdt: string | null;
  btc: string | null;
  gold: string | null;
}

export interface PortalModalState {
  active: boolean;
  text: string;
}

export interface SettingsLabels {
  reset: string;
  submit: string;
}

export interface OpenWeatherResponse {
  id?: number;
  name?: string;
  message?: string;
  coord?: { lat: number; lon: number };
  sys?: { country: string };
  weather?: Array<{ description: string; icon: string }>;
  main?: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  wind?: { speed: number };
}

export interface CityImageMeta {
  name: string;
  id: number | number[];
  images: Array<{ photographer: string; link: string }>;
}

export interface CityVideoMeta {
  name: string;
  id: number;
  videos: Array<{ channel: string; link: string }>;
}
