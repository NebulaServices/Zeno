import { defineConfig } from "vite";
import solid from "solid-start";

export default defineConfig({
  plugins: [solid({ ssr: false })],
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        secure: false
      },
      cors: "none"
    },
  }
});
