import sharp from 'sharp';
import { readdirSync, renameSync } from 'node:fs';
import { join, extname } from 'node:path';

const MAX = 1920;
const DIR = 'public/uploads';
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const files = readdirSync(DIR).filter(f => EXTS.has(extname(f).toLowerCase()));

for (const file of files) {
  const src = join(DIR, file);
  const img = sharp(src);
  const { width, height } = await img.metadata();

  if (width <= MAX && height <= MAX) {
    console.log(`skip     ${file} (${width}×${height})`);
    continue;
  }

  const tmp = src + '.tmp';
  await img
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(tmp);

  renameSync(tmp, src);
  console.log(`resized  ${file}  ${width}×${height} → max ${MAX}px`);
}
