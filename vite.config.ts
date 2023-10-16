import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // 1000 kB = 1 MB
    rollupOptions: {
      output: {
        manualChunks: {
          'react-chunk': [
            'react',
            'react-dom',
            '@emotion/cache',
            '@emotion/react',
            '@emotion/server',
            '@emotion/styled',
            '@mui/core',
            '@mui/icons-material',
            '@mui/lab',
            '@mui/material',
            '@mui/styles'
          ],
          'libs-chunk': [
            '@tensorflow/tfjs',
            '@tensorflow/tfjs-node',
            'axios',
            'apexcharts',
            'date-fns',
            'rxjs'
          ]
        }
      }
    }
  }
});
