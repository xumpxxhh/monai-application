import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '../..');
  const env = loadEnv(mode, envDir, '');
  return {
    plugins: [react()],
    envDir,
    base: env.VITE_APP_MARK_LIVE_BASE_PATH || '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        config: path.resolve(__dirname, '../../packages/config/index.ts'),
      },
    },
  };
});
