import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "web",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        app: resolve(__dirname, "vite-entry.html"),
      },
    },
  },
});
