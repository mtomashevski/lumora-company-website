import { defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { readServerConfig } from './app/server/config.server.ts';

export default defineConfig(({ mode }) => {
  // This is Node-only configuration. Never inject the whole environment via define.
  readServerConfig({ ...loadEnv(mode, process.cwd(), ''), ...process.env });
  return {
    base: '/',
    // No automatic environment export. Public runtime DTOs must be explicitly reviewed.
    envPrefix: [],
    publicDir: resolve('../public'),
    plugins: [tailwindcss(), reactRouter()],
    resolve: { dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'] },
    optimizeDeps: {
      include: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'react-router',
        'react-router/dom',
        'react-router-dom',
        'lucide-react',
      ],
    },
    server: { host: '127.0.0.1', port: 5190, strictPort: true },
  };
});
