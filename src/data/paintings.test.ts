import { describe, it, expect } from "vitest";
import { paintings, type Painting } from "./paintings.js";

describe("paintings", () => {
  it("contains 121 entries", () => {
    expect(paintings.length).toBe(121);
  });

  it("is sorted by slug descending (newest first)", () => {
    const slugs = paintings.map((p) => p.slug);
    const sorted = [...slugs].sort().reverse();
    expect(slugs).toEqual(sorted);
  });

  it("each entry has slug, filename, alt", () => {
    paintings.forEach((p: Painting) => {
      expect(p.slug).toMatch(/^\d{3}$/);
      expect(p.filename).toBe(`${p.slug}.jpg`);
      expect(p.alt).toBe(`Painting ${p.slug}`);
    });
  });

  it("highest slug is 121, lowest is 001", () => {
    const slugs = paintings.map((p) => p.slug);
    expect(slugs[0]).toBe("121");
    expect(slugs[slugs.length - 1]).toBe("001");
  });
});
