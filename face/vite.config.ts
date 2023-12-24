import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default ({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    base: loadedEnv.PUBLICPATH,
  });
};
