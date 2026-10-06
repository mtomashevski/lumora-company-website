import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
  ssr: true,
  appDirectory: 'app',
  buildDirectory:
    process.env.V2_BOUNDARY_TEST === '1'
      ? 'build-boundary'
      : process.env.V2_VERCEL_BUILD === '1'
        ? 'build-vercel'
        : 'build',
  // Local Node execution and Vercel output are tested independently.
  presets: process.env.V2_VERCEL_BUILD === '1' ? [vercelPreset()] : [],
} satisfies Config;
