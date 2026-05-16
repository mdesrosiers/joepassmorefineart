/// <reference types="astro/client" />

export type Painting = {
  slug: string;
  alt: string;
  title?: string;
  description?: string;
  etsyUrl?: string;
  medium?: string;
  year?: number;
};

const paintingModules = import.meta.glob<{ default: ImageMetadata }>("../assets/paintings/*.jpg", {
  eager: true,
});

function buildPaintings(): Painting[] {
  const entries = Object.keys(paintingModules)
    .map((path) => {
      const slug = path
        .split("/")
        .pop()!
        .replace(/\.jpg$/, "");
      return { slug, alt: `Painting ${slug}` } satisfies Painting;
    })
    // Slug-DESC: newest first. paintings[0] is the highest-numbered painting.
    // getNeighbors() inherits this order, so "prev" is newer and "next" is
    // older — the gallery reads naturally left-to-right by recency.
    .sort((a, b) => b.slug.localeCompare(a.slug, undefined, { numeric: true }));
  return entries;
}

export const paintings: readonly Painting[] = buildPaintings();

export function getPainting(slug: string): Painting | undefined {
  return paintings.find((p) => p.slug === slug);
}

/**
 * Returns the paintings adjacent to `slug` in gallery order.
 *
 * Because the gallery is sorted slug-DESC (newest first), `prev` is the
 * *newer* painting (higher slug) and `next` is the *older* painting (lower
 * slug). Detail pages render `prev` with a left arrow and `next` with a
 * right arrow, which matches gallery reading order even though it inverts
 * naive temporal intuition.
 *
 * Returns `{ prev: undefined, next: undefined }` for unknown slugs.
 */
export function getNeighbors(slug: string): {
  prev: Painting | undefined;
  next: Painting | undefined;
} {
  const i = paintings.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: paintings[i - 1],
    next: paintings[i + 1],
  };
}

export function getPaintingImage(slug: string): ImageMetadata | undefined {
  const path = `../assets/paintings/${slug}.jpg`;
  return paintingModules[path]?.default;
}
