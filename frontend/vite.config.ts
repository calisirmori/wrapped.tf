import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Correct the backend URL directly
        changeOrigin: true,
        secure: false, // Only set to true if using HTTPS in development
      },
    },
  },
});