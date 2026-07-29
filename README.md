### sc-weather

Weather dashboard for large screens — React + Vite.

## Setup

```bash
cp .env.example .env
# fill VITE_OPENWEATHER and VITE_YANDEX_MAP
npm install
npm start
```

## Scripts

- `npm start` / `npm run dev` — local dev server (port 3700)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run deploy` — publish `dist/` to GitHub Pages

## Env

| Variable | Description |
|---|---|
| `VITE_OPENWEATHER` | OpenWeatherMap API key |
| `VITE_YANDEX_MAP` | Yandex Maps API key |
| `VITE_PUBLIC_PATH` | Base path (default `/sc-weather/` in production) |
