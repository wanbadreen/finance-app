import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        consent: resolve(process.cwd(), 'oauth-consent.html'),
        split: resolve(process.cwd(), 'split.html'),
        about: resolve(process.cwd(), 'about.html'),
        privacy: resolve(process.cwd(), 'privacy.html'),
        terms: resolve(process.cwd(), 'terms.html'),
      },
    },
  },
});
