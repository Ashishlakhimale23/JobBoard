import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {config} from "dotenv"
import path from "path"

config()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    'process.env':process.env
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
