import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
  server: {
    watch: {
      usePolling: true,
    },
    port: 36112,
    open: true,
  },
});
