import { describe, it, expect } from "vitest";
import {
  paintings,
  getPainting,
  getNeighbors,
  getPaintingImage,
  type Painting,
} from "./paintings.js";

describe("paintings", () => {
  it("contains 121 entries", () => {
    expect(paintings.length).toBe(121);
  });

  it("is sorted by slug descending (newest first)", () => {
    const slugs = paintings.map((p) => p.slug);
    const sorted = [...slugs].sort().reverse();
    expect(slugs).toEqual(sorted);
  });

  it("each entry has slug and alt", () => {
    paintings.forEach((p: Painting) => {
      expect(p.slug).toMatch(/^\d{3}$/);
      expect(p.alt).toBe(`Painting ${p.slug}`);
    });
  });

  it("highest slug is 121, lowest is 001", () => {
    const slugs = paintings.map((p) => p.slug);
    expect(slugs[0]).toBe("121");
    expect(slugs[slugs.length - 1]).toBe("001");
  });

  it("getPainting returns the matching entry", () => {
    expect(getPainting("042")?.slug).toBe("042");
  });

  it("getPainting returns undefined for a missing slug", () => {
    expect(getPainting("999")).toBeUndefined();
  });

  it("getNeighbors at the first item (slug 121) has no prev", () => {
    const { prev, next } = getNeighbors("121");
    expect(prev).toBeUndefined();
    expect(next?.slug).toBe("120");
  });

  it("getNeighbors at the last item (slug 001) has no next", () => {
    const { prev, next } = getNeighbors("001");
    expect(prev?.slug).toBe("002");
    expect(next).toBeUndefined();
  });

  it("getNeighbors prev is newer (higher slug), next is older", () => {
    const { prev, next } = getNeighbors("050");
    expect(prev?.slug).toBe("051");
    expect(next?.slug).toBe("049");
  });

  it("getNeighbors returns undefined/undefined for unknown slug", () => {
    const { prev, next } = getNeighbors("999");
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });

  it("getPaintingImage returns ImageMetadata for a valid slug", () => {
    const img = getPaintingImage("042");
    expect(img).toBeDefined();
    // Under Astro's image plugin `img` is an ImageMetadata object with `.src`;
    // under plain Vite (vitest) it's the resolved path string. Either way the
    // slug must appear in the resolved reference.
    const ref = typeof img === "string" ? img : (img?.src ?? "");
    expect(ref).toMatch(/042/);
  });

  it("getPaintingImage returns undefined for a missing slug", () => {
    expect(getPaintingImage("999")).toBeUndefined();
  });
});
