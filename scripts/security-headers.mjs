import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Hash generated JSON-LD rather than allowing arbitrary inline scripts.
export async function securityHeaders(directory = 'dist') {
  const hashes = new Set();
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(file, 'utf8');
        for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
          if (/\bsrc\s*=/i.test(script[1]) || !script[2].trim()) continue;
          if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(script[1]))
            throw new Error(`Unexpected inline executable script in ${file}`);
          hashes.add(`'sha256-${createHash('sha256').update(script[2]).digest('base64')}'`);
        }
      }
    }
  }
  await visit(directory);
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' ${[...hashes].sort().join(' ')}`.trim(),
      "style-src 'self'",
      // Image cropping uses React's objectPosition style attribute.
      "style-src-attr 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const output = process.argv[2];
  if (!output) throw new Error('Specify the Nginx include output path');
  const headers = await securityHeaders();
  await writeFile(output, Object.entries(headers)
    .map(([name, value]) => `add_header ${name} "${value}" always;`).join('\n') + '\n');
}
