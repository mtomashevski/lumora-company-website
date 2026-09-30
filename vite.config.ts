import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { normalizeBasePath } from './src/utils/deployment.ts';
export default defineConfig(({ mode }) => ({
  base: normalizeBasePath(loadEnv(mode, process.cwd(), 'VITE_').VITE_BASE_PATH || '/'),
  plugins: [react(), tailwindcss()],
}));
