// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://nicholasmackey.github.io/hood-community-servicing/
  site: 'https://nicholasmackey.github.io',
  base: '/hood-community-servicing',

  // Inter is self-hosted and optimized by Astro's font pipeline.
  // The `--font-inter` variable is consumed by `--font-sans` in src/styles/global.css.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
