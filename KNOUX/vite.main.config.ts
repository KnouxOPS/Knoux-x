/**
 * ═══════════════════════════════════════════════════════════════════════
 * KNOUX Player X™ - Vite Main Config
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * إعدادات Vite لعملية Main
 * 
 * @module Config
 * @author KNOUX Development Team
 * @version 1.0.0
 */

import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Build configuration
  build: {
    lib: {
      entry: path.resolve(__dirname, 'electron/main.ts'),
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    outDir: '.vite/main',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [
        'electron',
        'electron-squirrel-startup',
        'electron-log',
        'path',
        'fs',
        'fs/promises',
        'crypto',
        'os',
        'url',
        'util',
      ],
    },
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
