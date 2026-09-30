/// <reference types="vite/client" />
// An explicit absolute pathname keeps assets and router links consistent on static hosts.
export function normalizeBasePath(value = '/') {
  if (
    !value.startsWith('/') ||
    /[?#\\]|\/\//.test(value) ||
    value.split('/').some((part) => part === '.' || part === '..')
  ) {
    throw new Error('VITE_BASE_PATH must be an absolute pathname, such as / or /your-project/.');
  }
  return value === '/' ? '/' : value.replace(/\/+$/, '') + '/';
}
export const basePath = normalizeBasePath(import.meta.env?.BASE_URL || '/');
export function publicAsset(path: string) {
  return path.startsWith('/') && !path.startsWith('//') ? basePath + path.slice(1) : path;
}
