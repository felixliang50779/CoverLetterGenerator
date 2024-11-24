import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
        {
          src: 'src/scripts/background.js',
          dest: '.'
        },
        {
          src: 'src/scripts/content.js',
          dest: '.'
        },
        {
          src: 'src/assets/images/icon16.png',
          dest: '.'
        },
        {
          src: 'src/assets/images/icon32.png',
          dest: '.'
        },
        {
          src: 'src/assets/images/icon48.png',
          dest: '.'
        },
        {
          src: 'src/assets/images/icon128.png',
          dest: '.'
        },
        {
          src: 'src/assets/images/alert-icon.png',
          dest: '.'
        },
        {
          src: 'src/assets/images/success-icon.png',
          dest: '.'
        }
      ],
    })
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});