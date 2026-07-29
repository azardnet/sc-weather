import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base =
    mode === "production" ? env.VITE_PUBLIC_PATH || "/sc-weather/" : "/";

  return {
    plugins: [react()],
    base,
    server: {
      port: 3700,
      open: true,
    },
    build: {
      outDir: "dist",
      assetsInlineLimit: 0,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `$base-url: "${base}";`,
        },
      },
    },
  };
});
