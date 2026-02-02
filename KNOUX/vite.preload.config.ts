/**
 * ═══════════════════════════════════════════════════════════════════════
 * KNOUX Player X™ - Vite Preload Config
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * إعدادات Vite لـ Preload Script
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
      entry: path.resolve(__dirname, 'electron/preload.ts'),
      formats: ['cjs'],
      fileName: () => 'preload.js',
    },
    outDir: '.vite/preload',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['electron'],
    },
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
