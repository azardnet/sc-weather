### sc-weather

Weather dashboard for large screens — React + Vite.

## Setup

```bash
cp .env.example .env
# fill VITE_OPENWEATHER and VITE_YANDEX_MAP
pnpm install
pnpm start
```

## Scripts

- `pnpm start` / `pnpm dev` — local dev server (port 3700)
- `pnpm build` — typecheck + production build to `dist/`
- `pnpm typecheck` — TypeScript only
- `pnpm preview` — preview production build
- `pnpm deploy` — publish `dist/` to GitHub Pages

## Structure

```
src/
  App.tsx
  components/             # typed UI
  hooks/useWeatherApp.ts  # app state & side effects
  lib/                    # utils, constants, cities, types
  style.scss
  vite-env.d.ts
```

## Env

| Variable | Description |
|---|---|
| `VITE_OPENWEATHER` | OpenWeatherMap API key |
| `VITE_YANDEX_MAP` | Yandex Maps API key |
| `VITE_PUBLIC_PATH` | Base path (default `/sc-weather/` in production) |
