import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import react from "@vitejs/plugin-react";
import manifest from "./manifest.json";


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build"
  },
  plugins: [
    react(),
    crx({ manifest })
  ]
});