import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  define: {
    global: 'globalThis'
  },
  esbuild: {
    target: 'es2020'
  }
})
