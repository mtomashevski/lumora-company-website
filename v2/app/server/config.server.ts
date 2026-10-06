type Environment = Record<string, string | undefined>;
const publicViteKeys = new Set(['VITE_SITE_URL', 'VITE_BASE_PATH', 'VITE_INQUIRY_ENDPOINT']);
export function readServerConfig(env: Environment) {
  for (const [name, value] of Object.entries(env)) {
    if (name.startsWith('VITE_') && value && !publicViteKeys.has(name)) {
      throw new Error(`Unapproved public environment variable: ${name}`);
    }
  }
  const appEnv = env.APP_ENV || 'development';
  if (env.VERCEL === '1' && (!env.APP_ENV || appEnv === 'development')) {
    throw new Error('Hosted Vercel execution requires explicit APP_ENV staging or production');
  }
  if (!['development', 'staging', 'production'].includes(appEnv)) {
    throw new Error('APP_ENV must be development, staging or production');
  }
  if (appEnv !== 'development' && !env.SITE_ORIGIN) {
    throw new Error('SITE_ORIGIN is required outside development');
  }
  const origin = env.SITE_ORIGIN || 'http://127.0.0.1:5190';
  const url = new URL(origin);
  if (
    url.origin !== origin ||
    url.username ||
    url.password ||
    (url.protocol !== 'https:' &&
      !(
        appEnv === 'development' &&
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      ))
  ) {
    throw new Error('SITE_ORIGIN must be an approved absolute origin; HTTPS is required remotely');
  }
  // Explicit public DTO. Secrets are never returned to loaders or browser components.
  return { appEnv, siteOrigin: origin };
}
