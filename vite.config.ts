// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      // namiesto "@/..." budeme mapovať na src/
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    open: "/index.html"
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "/index.html"
    }
  }
});
