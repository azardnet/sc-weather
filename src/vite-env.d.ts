/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER: string;
  readonly VITE_YANDEX_MAP: string;
  readonly VITE_PUBLIC_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface YMapsMap {
  destroy?: () => void;
}

interface YMaps {
  ready: (cb: () => void) => void;
  Map: new (
    element: HTMLElement | null,
    options: {
      center: [number, number];
      zoom: number;
      controls: string[];
    },
  ) => YMapsMap;
}

interface Window {
  ymaps: YMaps;
}
