export const site = {
  url: "https://joepassmorefineart.com",
  title: "Joe Passmore",
  fullTitle: "Joe Passmore — Fine Art",
  description:
    "Paintings by Joe Passmore, a Vancouver-based painter. Landscapes, figures, and scenes from a lifetime of work.",
  hero:
    "My work reflects what I see and admire in the world that we all live in, people and places that remain in my memory.",
  copyrightYear: 2026,
  social: {
    etsy: "https://www.etsy.com/ca/shop/joepassmorefineart",
    instagram: "https://www.instagram.com/joepassmorefineart/",
    facebook: "https://www.facebook.com/joe.passmore.33",
  },
} as const;

export type Site = typeof site;
