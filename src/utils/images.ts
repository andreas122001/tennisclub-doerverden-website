import type { ImageMetadata } from 'astro';

// Eagerly import every image that Decap CMS can upload.
// Vite processes this at build time — no runtime file I/O.
const uploads = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true }
);

// CMS writes  /uploads/filename.jpg  into content files.
// Astro images live at  src/assets/uploads/filename.jpg.
// This function bridges the two.
export function resolveImage(cmsSrc: string | null | undefined): ImageMetadata | undefined {
  if (!cmsSrc) return undefined;
  const key = cmsSrc.replace(/^\/uploads\//, '/src/assets/uploads/');
  return uploads[key]?.default;
}
