import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

// The Cloudflare plugin discovers wrangler.jsonc itself and runs the Worker
// (server/index.ts) in workerd during `vite dev` — so /api/* works locally
// with no separate API server.
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
});
