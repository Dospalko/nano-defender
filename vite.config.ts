import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  server: {
    // Otvorí index.html priamo na koreňovej URL
    open: "/index.html"
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // Vstupný bod je /index.html, nie /public/index.html
      input: "/index.html"
    }
  }
});
