import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Make sure this import is here!

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <-- 2. Make sure this plugin is activated!
  ],
})
