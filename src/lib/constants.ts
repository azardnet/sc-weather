export const MAP_URL = `https://api-maps.yandex.ru/2.1/?lang=en&apikey=${import.meta.env.VITE_YANDEX_MAP}`;
export const OPEN_WEATHER_KEY = import.meta.env.VITE_OPENWEATHER as string;
export const UNIT = "°C";
export const DEFAULT_CITY = "Tehran";
export const TO_FIXED = 2;

export const REQUEST_INTERVAL = 10 * 60 * 1000;
export const LOADING_DELAY = 500;
export const PORTAL_MODAL_DELAY = 2500;
export const CREATE_MAP_DELAY = 3000;
export const SPEED_DETECTION_DELAY = 10000;
export const MARKET_REFRESH_INTERVAL = 500000;

export const DEFAULT_COLOR = "#072322";
export const DEFAULT_OPACITY = 90;
export const DEFAULT_ANIMATION_DURATION = 120;
