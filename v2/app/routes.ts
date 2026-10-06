import { index, route, type RouteConfig } from '@react-router/dev/routes';
export default [
  index('routes/entry.tsx'),
  route(':locale', 'routes/catalog.tsx'),
  route(':locale/experiences/:slug', 'routes/tour.tsx'),
  route('health', 'routes/health.ts'),
  route('*', 'routes/missing.tsx'),
] satisfies RouteConfig;
