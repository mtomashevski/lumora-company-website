import { createHash } from 'node:crypto';
export function serverProof() {
  const marker = process.env.LUMORA_SERVER_TEST_SENTINEL || 'phase-one-server-module';
  return createHash('sha256').update(marker).digest('hex');
}
