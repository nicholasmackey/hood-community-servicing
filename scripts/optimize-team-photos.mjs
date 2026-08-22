/*
 * Derives the responsive WebP in public/images/team/ from the full-size
 * originals Hood supplied.
 *
 * Usage:
 *   pnpm add -D sharp
 *   node scripts/optimize-team-photos.mjs <source-directory>
 *
 * sharp is not a project dependency on purpose — nothing in the build needs
 * it, and the deploy has no native module to resolve. Install it when new
 * photography lands, run this, and remove it again.
 *
 * The source directory holds one file per photo, named for what it is:
 * team-guard-crew.jpg becomes team-guard-crew-400.webp and so on. Anything
 * that is already narrower than a given width is left at its own size rather
 * than being scaled up.
 */
import { readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

// Displayed at ~22vw in the four-across row and at most 100vw as the phone
// anchor, so 1000 covers a 2x phone and 640 covers a 2x column.
const WIDTHS = [400, 640, 1000];
const QUALITY = 76;

const source = process.argv[2];

if (!source) {
  console.error('Usage: node scripts/optimize-team-photos.mjs <source-directory>');
  process.exit(1);
}

const outDir = fileURLToPath(new URL('../public/images/team/', import.meta.url));
await mkdir(outDir, { recursive: true });

const originals = (await readdir(source)).filter((name) => /\.(jpe?g|png|webp)$/i.test(name));

for (const name of originals) {
  const base = path.parse(name).name;

  for (const width of WIDTHS) {
    const { size } = await sharp(path.join(source, name))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(path.join(outDir, `${base}-${width}.webp`));

    console.log(`${base}-${width}.webp`.padEnd(36), `${(size / 1024).toFixed(0)}KB`);
  }
}
