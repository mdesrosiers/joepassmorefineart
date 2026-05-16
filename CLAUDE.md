# Joe Passmore Fine Art

Static portfolio site for the painter Joe Passmore. 121 paintings, 4 content pages, fully prerendered.

Live: https://joepassmorefineart.com (deployed from `master` to Netlify).

## Stack

Astro 6 · Tailwind 4 (`@tailwindcss/vite`) · TypeScript strict · Sharp images · Vitest unit tests · Playwright e2e (Chromium desktop + WebKit mobile) · `@axe-core/playwright` for WCAG AA · Husky + lint-staged · Renovate auto-updates · Netlify static hosting with strict CSP.

Use `.nvmrc` (Node 22) and the `packageManager` field in `package.json` (pnpm 9.15.9). Local Volta or nvm both work.

## Workflow

`master` is protected by a GitHub ruleset and a local Husky `pre-commit` hook — direct commits are blocked. Every change goes through a PR:

1. `git switch -c <type>/<short-name>` (e.g. `feat/etsy-metadata`, `fix/lightbox-swipe`, `chore/...`, `docs/...`).
2. Commit, push, open a PR against `master`.
3. Enable auto-merge with squash: `gh pr merge --auto --squash --delete-branch`. GitHub squash-merges once required checks pass (typecheck, unit, build, Playwright, Netlify deploy preview) and deletes the branch.
4. To check whether a PR has merged later, run `gh pr list --state merged --limit 5` or `gh pr view <num>` — there's no background notification.

After a merge: `git switch master && git pull --ff-only` before starting the next branch.

## Commands

```bash
pnpm dev          # local dev server (http://localhost:4321)
pnpm build        # production build → dist/
pnpm preview      # serve dist/
pnpm typecheck    # astro check (strict)
pnpm test:unit    # Vitest (data layer tests)
pnpm test         # Playwright (lightbox + a11y)
pnpm csp-hash     # recompute CSP hash for inline theme-setter
```

## Architecture

```
src/
├── data/
│   ├── paintings.ts     # 121 paintings discovered via import.meta.glob
│   └── site.ts          # site-wide constants (URL, social, copy)
├── components/          # Astro components
│   ├── Lightbox.astro   # native <dialog>; script in src/scripts/lightbox.ts
│   └── ThemeToggle.astro # script in src/scripts/theme-toggle.ts
├── scripts/             # external client TS (CSP-friendly; see Gotchas)
├── pages/
│   └── paintings/[slug].astro  # generated for all 121 via getStaticPaths
└── styles/global.css    # Tailwind 4 theme tokens (light + dark)

scripts/
├── csp-script.mjs       # source of truth for the inline pre-paint script
└── compute-csp-hash.mjs # SHA-256 it; output goes into netlify.toml
```

The lightbox is the only meaningful client JS. Gallery thumbnails are real `<a>` links to detail pages, so the site works without JS and every painting URL is independently crawlable.

## Gotchas

**CSP couples three files.** `scripts/csp-script.mjs` (the inline theme-setter) is hashed into `script-src` in `netlify.toml`. If you edit the script, run `pnpm csp-hash` and update `netlify.toml`. The hash is currently `'sha256-Kn3l3xoBEP9ZKr53KMM5zvJCxKOoTelOKVMOwmatu1o='`.

**Component scripts must stay external.** `astro.config.mjs` sets `vite.build.assetsInlineLimit: 0` to force `<script>` blocks in components to ship as `<script src="/_astro/...">` chunks instead of inline modules. Inline modules would be CSP-blocked because they have no hash. Don't remove that config.

**Netlify needs `NODE_ENV=development`.** Set in `netlify.toml`. Without it, pnpm skips devDependencies and Astro's runtime transitive deps (clsx, etc.) get pruned, breaking the build. Astro's own build phase still produces a production bundle internally.

**`clsx` is a direct dep.** Astro pulls `clsx` transitively at build time; under pnpm the package isn't always hoisted to `node_modules/clsx` where Node resolution finds it on Netlify. Pinning it explicitly avoids the flakiness.

**`prepare: "husky || true"`.** Husky is a devDep so it's missing in environments that prune devDeps. The `|| true` lets the script no-op cleanly.

**`[slug]` in shell paths.** zsh expands brackets — quote it: `git add 'src/pages/paintings/[slug].astro'`.

**Painting alt text is `Painting NNN`.** The `Painting` type reserves optional `title`, `description`, `etsyUrl`, `medium`, `year` for a future Etsy enrichment project. Don't fabricate metadata. Detail pages and lightbox already gate UI on those optional fields.

**Painting prev/next semantic.** `getNeighbors("050")` returns `prev=051, next=049` — paintings are sorted slug-DESC (newest first), so "prev" is _newer_. The detail page renders `prev` with `←`, `next` with `→` — left-arrow goes to a higher slug.

**Sitemap excludes 404.** Astro's `@astrojs/sitemap` does this by default; don't add a manual 404 entry.

## Testing

`pnpm test` runs Playwright on real WebKit (mobile) + Chromium (desktop). The mobile project tests the iOS-specific edge-swipe guard and `100dvh` handling. If you change the lightbox swipe logic, install WebKit if missing:

```bash
pnpm exec playwright install --with-deps webkit
```

A11y tests force `colorScheme: light` globally and emulate `dark` per-test, because the pre-paint script reads `prefers-color-scheme` from the OS otherwise (host-dependent flakiness).

## CI and operations

- Renovate runs as a GitHub App; `renovate.json` is just config. Auto-merges dev deps and runtime patches; runtime minor/major and vulnerability advisories are manual.
- CI lives in `.github/workflows/ci.yml` — typecheck → unit tests → build → Playwright (Chromium + WebKit). Browser binaries cached by `pnpm-lock.yaml` hash.
- Netlify Lighthouse plugin runs informationally on each deploy (no thresholds yet) — see `netlify.toml`.

## Backlog

- Etsy metadata enrichment — separate research project. The `Painting` type already accepts the optional fields (`title`, `description`, `etsyUrl`, `medium`, `year`); UI lights up automatically when populated.
- Analytics decision — Plausible recommended (one external host = tight CSP). Currently no analytics.
- Lighthouse thresholds — set `[plugins.inputs.thresholds]` in `netlify.toml` once 2-3 deploys' worth of real scores exist.

## Reference docs

- `docs/superpowers/specs/2026-05-15-gatsby-to-astro-rewrite-design.md` — full design spec
- `docs/superpowers/plans/2026-05-15-gatsby-to-astro-rewrite.md` — 32-task implementation plan
