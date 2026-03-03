import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '../..'),
  base: '/mark-live',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      config: path.resolve(__dirname, '../../packages/config/index.ts'),
    },
  },
});
