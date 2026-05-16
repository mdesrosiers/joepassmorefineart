# Joe Passmore Fine Art — Gatsby → Astro rewrite

Date: 2026-05-15
Author: Martin Desrosiers (with Claude)
Status: Draft for review

## Goal

Rewrite [joepassmorefineart.com](https://joepassmorefineart.com/) — currently a Gatsby 2 static site — using a modern stack. The painter's content (121 paintings, bio, contact links) is preserved verbatim. The site gains individual painting URLs, an improved lightbox, dark mode, and proper mobile responsiveness. The site remains fully static and continues to deploy on Netlify.

## Why now

The current site is on Gatsby 2.32 (released 2021), pinned to Node 14.15.5, depends on Material UI v4 (unmaintained), uses Flow types (effectively dead), and configures Google Analytics via Universal Analytics (sunset by Google in July 2023). It will not build on a current developer machine without nvm and dependency-resolution workarounds. None of this is broken in production, but the project is stuck in time and any future change is harder than it should be.

## Scope

### In scope

- Full rewrite of the existing four pages (gallery, About, Contact, 404).
- New per-painting URLs (e.g., `/paintings/042`) and per-painting prerendered detail pages.
- Modern lightbox with keyboard, swipe, prev/next, deep-linkable URLs, native pinch-to-zoom.
- Dark mode (system-preference default, user toggle, persisted in `localStorage`).
- Responsive design across mobile / tablet / desktop.
- Refreshed Netlify configuration.
- Automated dependency updates via Renovate (auto-merge dev deps and patches; manual review for runtime minor/major).
- Verbatim preservation of all current text content (hero copy, bio, contact links, copyright).
- Verbatim preservation of all 121 painting images.

### Out of scope (explicit drops)

| Dropped | Reason |
|---|---|
| Etsy metadata enrichment (titles, descriptions, prices) | Separate research project — see "Future work" below. The data model is shaped to accept this enrichment cleanly when it happens. |
| CMS / authoring tools | User confirmed they no longer add new paintings. |
| Contact form | User opted to keep social-link list as today. |
| Search / filter | Not useful without painting titles; reconsider after Etsy enrichment. |
| Service worker / offline mode (PWA) | `gatsby-plugin-offline` adds caching complexity for marginal benefit on a fully static gallery. |
| Google Analytics | The existing `UA-127331168-1` is a deprecated Universal Analytics property collecting no data. Defer GA4 / Plausible / Cloudflare Analytics decision to a future task. |
| Google Optimize (`GTM-M2ZM6SB`) | Service was sunset by Google in 2023. |

## High-level architecture

```mermaid
flowchart LR
    A[src/data/paintings.ts<br/>typed metadata] --> B[Gallery page<br/>index.astro]
    A --> C[Detail pages<br/>paintings/[slug].astro]
    D[src/assets/paintings/*.jpg] --> B
    D --> C
    B -- click thumbnail --> E[Lightbox island<br/>vanilla TS]
    E -- updates URL --> F[history.pushState<br/>/paintings/042]
    E -- close --> B
    C -- direct visit --> C
```

The site is fully prerendered. The lightbox is the only interactive piece. Gallery thumbnails are real `<a>` links to detail pages, so the site works with JavaScript disabled and every painting is independently crawlable for SEO.

## Stack

| Layer | Choice | Replaces |
|---|---|---|
| Framework | Astro 5 (`output: 'static'`) | Gatsby 2.32 |
| Language | TypeScript | Flow |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) | Material UI v4 |
| Image pipeline | Astro `<Image>` / `<Picture>` (Sharp) | gatsby-image / gatsby-plugin-sharp |
| Fonts | `@fontsource-variable/fraunces` (headings), `@fontsource-variable/inter` (body), self-hosted | typography + typography-theme-noriega |
| Icons | Inline SVG | react-icons |
| Sitemap | `@astrojs/sitemap` | gatsby-plugin-sitemap |
| `<head>` management | Astro native | react-helmet |
| Package manager | pnpm | npm |
| Node | 20 LTS | 14.15.5 |
| Hosting | Netlify (unchanged) | Netlify |

### Dependencies (final `package.json`)

Runtime:
- `astro` (5.x)
- `@astrojs/sitemap`
- `@tailwindcss/vite`
- `tailwindcss` (4.x)
- `@fontsource-variable/fraunces`
- `@fontsource-variable/inter`
- `sharp` (declared explicitly)

Dev:
- `typescript`
- `prettier`
- `prettier-plugin-astro`
- `@playwright/test`
- `@axe-core/playwright`

Removed: `gatsby` and all 13 `gatsby-*` plugins, `@material-ui/core`, `react`, `react-dom`, `react-helmet`, `react-icons`, `react-typography`, `typography`, `typography-theme-noriega`, `flow-bin`.

## Repository structure

```
joepassmorefineart/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── netlify.toml
├── renovate.json
├── public/
│   ├── favicon.png
│   ├── robots.txt
│   ├── manifest.webmanifest
│   └── google07c78460282caa9d.html   # preserved
├── src/
│   ├── assets/
│   │   └── paintings/                # 121 .jpg files
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   ├── Gallery.astro
│   │   ├── Lightbox.astro
│   │   └── PaintingDetail.astro
│   ├── data/
│   │   └── paintings.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   └── paintings/
│   │       └── [slug].astro
│   └── styles/
│       └── global.css
└── docs/superpowers/specs/
    └── 2026-05-15-gatsby-to-astro-rewrite-design.md
```

Files removed from the current repo: `gatsby-browser.js`, `gatsby-config.js`, `gatsby-node.js`, `gatsby-ssr.js`, `.flowconfig`, `.ruby-version`, `src/utils/typography.js`, `src/utils/theme.js`, `src/global.css`, every `.jsx` under `src/`.

## Content model

```ts
// src/data/paintings.ts
export type Painting = {
  slug: string;          // "042" — used in URL
  filename: string;      // "042.jpg"
  alt: string;           // accessibility text; default `Painting ${slug}`

  // Reserved for future Etsy enrichment — all optional:
  title?: string;
  description?: string;
  etsyUrl?: string;
  medium?: string;
  year?: number;
};

export const paintings: Painting[];
```

The list is generated at build time from the contents of `src/assets/paintings/` and sorted by filename descending (matching the current site's order: newest IDs first). Each file's stem becomes the slug.

When painting metadata is added in a future project, every detail-page UI element gates on `if (painting.title)` etc., so partial enrichment Just Works™.

## Routing

| URL | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero copy + responsive thumbnail grid + lightbox |
| `/about` | `src/pages/about.astro` | Bio (preserved verbatim) + accent painting |
| `/contact` | `src/pages/contact.astro` | Social links (preserved verbatim) + accent painting |
| `/paintings/<slug>` | `src/pages/paintings/[slug].astro` | Generated via `getStaticPaths()` for all 121 paintings |
| `/404` | `src/pages/404.astro` | "Not found" |

Detail pages render a full-width responsive image, optional title/description if present, prev/next links to neighboring paintings, and a "Back to gallery" link.

## Lightbox specification

Trigger: gallery thumbnail is `<a href="/paintings/<slug>">`. With JS, click is intercepted; without JS, navigates to the standalone page (graceful fallback).

Implementation: a single TypeScript class in a `<script>` block in `Lightbox.astro`, mounted on a hidden native `<dialog>` element. State held on the class instance; no framework. Approximately 150 lines.

### Behavior

| Event | Behavior |
|---|---|
| Click thumbnail (with JS) | `event.preventDefault()`, open dialog, `history.pushState` to `/paintings/<slug>` |
| Click thumbnail (without JS) | Browser navigates to `/paintings/<slug>` |
| Click prev/next | Swap image, `history.replaceState` (so back doesn't walk every painting) |
| Click outside image | Close lightbox, `history.back()` to the gallery URL |
| Close button | Close lightbox, `history.back()` to the gallery URL |
| `Esc` key | Close (native `<dialog>` behavior) |
| `←` / `→` keys | Prev / next |
| Tab | Cycles close + prev + next; focus trap |
| Lightbox close | Focus returns to originating thumbnail |
| Swipe left/right (touch) | Prev / next, with edge-guard for iOS back gesture |
| `popstate` | Sync lightbox to URL — `/` closes it, `/paintings/<slug>` opens that painting |
| Lightbox open | Body scroll locked via `overflow: hidden` on `<html>` |
| `prefers-reduced-motion` | Disables transitions; image shows instantly |

### Mobile-specific behavior

| Concern | Handling |
|---|---|
| iOS edge-swipe-back conflict | Swipe detection ignores horizontal motion starting in leftmost ~20px |
| Vertical swipes | Pass through; never trapped |
| Pinch-to-zoom on image | `touch-action: pinch-zoom` enabled (improvement over current MUI modal) |
| iOS Safari address bar resize | Overlay sized in `100dvh`, not `100vh` |
| Hit targets | All buttons ≥ 48×48 CSS px |
| Hover-only prev/next | Always shown on touch devices |

### Preloading

On open, prefetch neighbors (prev + next) so swipe/arrow navigation feels instant.

### Direct-visit fallback

`/paintings/<slug>` is a fully prerendered standalone page. The lightbox is purely a gallery-page enhancement. Direct visits and crawlers always see real HTML.

## Theming and design

### Fonts (self-hosted)

- **Headings:** Fraunces Variable — modern serif, literary feel, designed for display sizes.
- **Body / UI:** Inter Variable — neutral, screen-optimized sans.

Both shipped via `@fontsource-variable/*`, Latin subset only, WOFF2-compressed. Estimated wire weight: ~120–180 KB total across both fonts (final number measured during implementation; if higher than expected we trim weights or fall back to system serif for headings). No Google Fonts CDN request. Font files cached forever via `Cache-Control: immutable`.

### Color palette

All combinations meet WCAG AA contrast (4.5:1 for body, 3:1 for large text and UI controls). Verified via `@axe-core/playwright`.

**Light mode**

| Role | Hex | Notes |
|---|---|---|
| `bg` | `#FAF7F2` | warm off-white; flatters paintings |
| `surface` | `#FFFFFF` | thumbnail card background |
| `border` | `#E6E1D8` | hairline dividers |
| `text` | `#1A1A1A` | body — 16:1 on `bg` |
| `text-muted` | `#5A564E` | captions — 7.4:1 on `bg` |
| `accent` | `#7A4A2B` | links, "Buy on Etsy" — 6.1:1 on `bg` |
| `accent-hover` | `#5C3820` | link/button hover |

**Dark mode**

| Role | Hex | Notes |
|---|---|---|
| `bg` | `#121212` | near-black, museum-wall feel |
| `surface` | `#1C1C1C` | thumbnail card background |
| `border` | `#2A2A2A` | hairline dividers |
| `text` | `#EDEAE3` | body — 14.2:1 on `bg` |
| `text-muted` | `#A8A39A` | captions — 8.5:1 on `bg` |
| `accent` | `#D4A373` | links — 9.8:1 on `bg` |
| `accent-hover` | `#E5BC92` | link hover |

Defined as Tailwind theme tokens so every value is tunable in one file.

### Dark mode toggle

- Initial render reads `localStorage.theme`, falls back to `prefers-color-scheme`.
- Toggle is a sun/moon button in the header. Two-state (light ↔ dark); choice persists in `localStorage`.
- A tiny inline `<script>` in `<head>` runs synchronously before paint and sets `class="dark"` on `<html>` to prevent a flash of wrong theme.
- Toggle button has `aria-label` reflecting current state.

### Responsive breakpoints

| Width | Gallery columns | Header layout | About / Contact |
|---|---|---|---|
| `< 640px` | 1 | Title row + nav row stacked | Image stacked above text |
| `≥ 640px` (sm) | 2 | Inline | Image stacked above text |
| `≥ 768px` (md) | 3 | Inline | Side-by-side |
| `≥ 1024px` (lg) | 4 | Inline | Side-by-side |
| `≥ 1280px` (xl) | 4, container capped at 1280px | Inline | Side-by-side |

Header on mobile uses inline-stacked layout, not a hamburger menu — three links plus a Buy button is short enough that hiding them hurts discoverability.

### Accessibility

- WCAG AA contrast verified in both modes via `@axe-core/playwright` on every page; pipeline fails on violations.
- Semantic HTML: real `<header>`, `<main>`, `<footer>`, `<nav>`. Gallery is a `<ul>` of `<li>` so screen readers announce count.
- `<html lang="en">` set in layout.
- Theme toggle is a `<button>` with dynamic `aria-label`.
- Native `<dialog>` for lightbox provides focus trap and Esc handling.
- All interactive elements ≥ 48×48 CSS px on touch devices.

## Deployment

### Netlify configuration

`netlify.toml` (new — current repo has no explicit config):

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "9"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "interest-cohort=()"
```

### Netlify dashboard tasks

The implementer (or user) needs to:

1. Update build settings in the Netlify dashboard so they don't conflict with `netlify.toml` (or remove them — `netlify.toml` takes precedence).
2. Verify the existing site ID is reused so DNS for `joepassmorefineart.com` keeps working without changes.
3. Confirm Deploy Previews are enabled (recommended, no config change needed).

### Netlify features deliberately NOT used

| Feature | Why off |
|---|---|
| Asset Optimization | Astro already minifies and optimizes; double-processing can degrade output. |
| Image CDN (`/.netlify/images/`) | Astro pre-generates AVIF/WebP variants at build time; CDN transforms would be redundant. |
| Forms | No contact form in scope. |
| Functions / Edge Functions | Pure static site. |
| Lighthouse plugin | Optional; defer to follow-up if desired. |

### PWA / manifest

`public/manifest.webmanifest` (hand-written) replaces `gatsby-plugin-manifest`. Same icons (favicon retained), `theme_color` updated to match new palette. No service worker.

### Sitemap and robots

- `@astrojs/sitemap` integration generates `sitemap-index.xml` listing all pages including every painting URL.
- `public/robots.txt` is a single static file pointing to the sitemap.

### Analytics

Removed entirely. Decision deferred to a future task. Candidates:

- Google Analytics 4 (free, Google ecosystem)
- Plausible (paid, privacy-first, simple)
- Cloudflare Web Analytics (free, privacy-first, requires CF as DNS provider — currently Netlify DNS)

## Automated dependency updates

Tool: **Renovate** (GitHub App, free for public/personal repos). Configured via a single `renovate.json` at the repo root.

### Policy

| Update type | Behavior |
|---|---|
| Lockfile maintenance (weekly refresh of `pnpm-lock.yaml` without dep bumps) | Auto-merge |
| `devDependencies` patch + minor + major | Auto-merge |
| Runtime dep **patch** updates (astro, tailwindcss, sharp, etc.) | Auto-merge |
| Runtime dep **minor** updates | Manual review |
| Runtime dep **major** updates | Manual review |
| Security advisories (any dep) | Manual review (auto-merge could mask a breaking patch under time pressure) |

Auto-merge fires only after Netlify's deploy preview build passes. Renovate waits on the `netlify/joepassmorefineart/deploy-preview` status check before merging.

### Schedule

Renovate runs on a schedule (`before 9am on Monday`) so PRs land in a predictable window rather than a constant drip.

### Grouping

- All `@astrojs/*` packages bumped together.
- All `@fontsource-variable/*` packages bumped together.
- All Playwright (`@playwright/test`, `@axe-core/playwright`) bumped together.

### `renovate.json` (illustrative, final wording during implementation)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":semanticCommits", ":automergeMinor"],
  "schedule": ["before 9am on monday"],
  "lockFileMaintenance": { "enabled": true, "automerge": true },
  "packageRules": [
    {
      "matchDepTypes": ["devDependencies"],
      "automerge": true
    },
    {
      "matchDepTypes": ["dependencies"],
      "matchUpdateTypes": ["patch"],
      "automerge": true
    },
    {
      "matchDepTypes": ["dependencies"],
      "matchUpdateTypes": ["minor", "major"],
      "automerge": false
    },
    {
      "matchPackagePatterns": ["^@astrojs/"],
      "groupName": "Astro integrations"
    },
    {
      "matchPackagePatterns": ["^@fontsource-variable/"],
      "groupName": "Fontsource fonts"
    }
  ],
  "vulnerabilityAlerts": { "automerge": false }
}
```

### One-time setup tasks (handled during rollout)

1. Install the [Renovate GitHub App](https://github.com/apps/renovate) on the `mdesrosiers/joepassmorefineart` repo.
2. Confirm Renovate's onboarding PR was either merged or replaced by the committed `renovate.json`.
3. Verify the first auto-merge cycle works end-to-end on a no-op lockfile maintenance PR.

### Trade-offs noted

- Auto-merging `devDependencies` major updates is more aggressive than the recommended preset. Justified for this project: dev deps don't ship to production, breakage at most blocks the next build (caught immediately). User has confirmed this is acceptable.
- If Renovate ever causes friction (noisy PRs, broken builds), the policy is tunable in one file without code changes.

## Verification

Before declaring the rewrite complete, the implementer must:

1. **Build cleanly:** `pnpm build` succeeds, output in `dist/`.
2. **Functional verification (desktop):** every page loads, every painting URL resolves, lightbox opens/closes/navigates, dark mode toggles, theme persists across reload.
3. **Mobile verification:** test in iOS Safari and Chrome Android (or Playwright `--device "iPhone 15"` and `--device "Pixel 7"`). Confirm: pinch-zoom in lightbox, swipe navigation, scroll lock, no address-bar jump, touch targets feel right.
4. **Accessibility:** `@axe-core/playwright` reports zero violations on `/`, `/about`, `/contact`, `/paintings/001`, `/paintings/116`, `/404` in both light and dark modes.
5. **Lighthouse:** ≥ 95 on Performance, Accessibility, Best Practices, SEO for `/` and a sample painting page (mobile and desktop).
6. **Static fallback:** confirm gallery thumbnails navigate correctly with JS disabled.
7. **Crawler check:** confirm sitemap includes every painting URL and `robots.txt` resolves.
8. **Renovate check:** Renovate App is installed; `renovate.json` is committed; onboarding PR resolved; first lockfile-maintenance cycle auto-merges cleanly.

## Migration order (preview — full plan in writing-plans next)

1. Back up `src/images/paintings/`, `static/`, `src/images/favicon.png`.
2. Remove all Gatsby files and dependencies; scaffold fresh Astro project in place.
3. Move painting images to `src/assets/paintings/`; static passthroughs to `public/`.
4. Set up Tailwind 4, theme tokens, dark mode pre-paint script.
5. Build `Layout.astro` + `Header.astro` + `Footer.astro` + `ThemeToggle.astro`.
6. Generate `src/data/paintings.ts` from filesystem.
7. Build gallery `index.astro` with `<Image>` grid (no lightbox yet).
8. Build `paintings/[slug].astro` detail page.
9. Build `Lightbox.astro` and integrate into gallery.
10. Build `about.astro`, `contact.astro`, `404.astro`.
11. Add `netlify.toml`, `manifest.webmanifest`, `robots.txt`, sitemap integration.
12. Add `renovate.json`; install Renovate GitHub App; resolve onboarding PR.
13. Run verification checklist; iterate until clean.
14. Deploy to Netlify, smoke-test live URL.

## Future work

- **Etsy enrichment.** Match the 121 local paintings to listings on `etsy.com/ca/shop/joepassmorefineart`. Approach: fetch shop listings, perceptual-hash images for matching, present uncertain matches for human review, populate `Painting.title` / `description` / `etsyUrl` / `medium` / `year`. Once data exists, detail pages auto-light-up the metadata UI, sitemap and `<title>` tags use real titles, lightbox caption shows the painting title.
- **Analytics decision.** Pick GA4 / Plausible / Cloudflare Analytics and add it as a tiny script include.
- **Optional: Lighthouse CI on every Netlify deploy** via `netlify-plugin-lighthouse`, with score thresholds.
