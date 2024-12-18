import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        if (warning.code === "THIS_IS_UNDEFINED") return;
        warn(warning);
      },
    },
  },
});
