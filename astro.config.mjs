// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Absolute base for canonical links and Open Graph image URLs — social crawlers
  // reject relative paths, so `Astro.site` has to be set for the meta card to resolve.
  site: 'https://hoodcommunityservicing.com',

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
