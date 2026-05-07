import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- DEVE ESSERCI QUESTO
import path from "path"

export default defineConfig({
  plugins: [
    tailwindcss(), // <--- DEVE ESSERCI QUESTO PRIMA DI REACT
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})