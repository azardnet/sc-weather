import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = mode === "production" ? env.VITE_PUBLIC_PATH || "/sc-weather/" : "/";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base,
    server: {
      port: 3700,
      open: true,
    },
    build: {
      outDir: "dist",
      assetsInlineLimit: 0,
    },
  };
});
