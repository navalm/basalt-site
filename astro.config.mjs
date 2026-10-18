// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://basalt.navalm.com',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
