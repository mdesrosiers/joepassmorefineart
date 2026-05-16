/// <reference types="astro/client" />

export type Painting = {
  slug: string;
  filename: string;
  alt: string;
  title?: string;
  description?: string;
  etsyUrl?: string;
  medium?: string;
  year?: number;
};

const paintingModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/paintings/*.jpg",
  { eager: true }
);

function buildPaintings(): Painting[] {
  const entries = Object.keys(paintingModules)
    .map((path) => {
      const filename = path.split("/").pop()!;
      const slug = filename.replace(/\.jpg$/, "");
      return {
        slug,
        filename,
        alt: `Painting ${slug}`,
      } satisfies Painting;
    })
    .sort((a, b) => b.slug.localeCompare(a.slug, undefined, { numeric: true }));
  return entries;
}

export const paintings: readonly Painting[] = buildPaintings();

export function getPainting(slug: string): Painting | undefined {
  return paintings.find((p) => p.slug === slug);
}

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
