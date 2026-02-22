import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/webhook-test": {
        target: "https://ieee.anjoostech.cfd",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, "")
      },
      "/api/webhook": {
        target: "https://ieee.anjoostech.cfd",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})




























