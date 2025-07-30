import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  server: { open: "/public/index.html" },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { input: "/public/index.html" }
  }
});
