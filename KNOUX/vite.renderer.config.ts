/**
 * ═══════════════════════════════════════════════════════════════════════
 * KNOUX Player X™ - Vite Renderer Config
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * إعدادات Vite لعملية Renderer
 * 
 * @module Config
 * @author KNOUX Development Team
 * @version 1.0.0
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Base URL
  base: './',
  
  // Build configuration
  build: {
    outDir: '.vite/renderer',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        splash: path.resolve(__dirname, 'splash.html'),
      },
    },
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@native': path.resolve(__dirname, 'native'),
    },
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
  
  // Server configuration
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true,
    },
  },
  
  // Preview configuration
  preview: {
    port: 3000,
    strictPort: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'zustand',
      '@google/generative-ai',
      'lucide-react',
    ],
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
