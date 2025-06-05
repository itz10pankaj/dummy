
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
json: {
    stringify: true
  },
  server: {
    fs: {
      allow: ['.']
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  build:{
    ssr:true
  }

})
