# Joe Passmore Fine Art

[![Netlify Status](https://api.netlify.com/api/v1/badges/5884f3e8-a4d2-405c-9b9f-57b0b18eb082/deploy-status)](https://app.netlify.com/sites/joepassmorefineart/deploys)

Static portfolio site for the painter Joe Passmore — 121 paintings, fully prerendered, deployed at [joepassmorefineart.com](https://joepassmorefineart.com/).

## Stack

Astro 6 · Tailwind 4 · TypeScript · Sharp images · Vitest · Playwright (Chromium + WebKit) · Husky + lint-staged · Renovate · Netlify.

Requires **Node 22.12+** (see `.nvmrc`) and **pnpm 9.15.9+** (pinned in `package.json` `packageManager`).

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

## Commands

| Command          | What it does                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `pnpm dev`       | Local dev server with HMR                                                                              |
| `pnpm build`     | Production build → `dist/`                                                                             |
| `pnpm preview`   | Serve `dist/` locally                                                                                  |
| `pnpm typecheck` | `astro check` (strict TypeScript)                                                                      |
| `pnpm test:unit` | Vitest — painting data layer                                                                           |
| `pnpm test`      | Playwright — lightbox + WCAG AA accessibility                                                          |
| `pnpm format`    | Prettier across the repo                                                                               |
| `pnpm csp-hash`  | Recompute CSP hash for the inline theme script (see CLAUDE.md before editing `scripts/csp-script.mjs`) |

## Architecture

```
src/
├── assets/paintings/    # 121 source JPGs (glob-imported)
├── data/                # painting list + site constants
├── components/          # Astro components (one per concern)
├── scripts/             # external client TS (lightbox, theme toggle)
├── layouts/Layout.astro # shared shell
├── pages/               # routes; paintings/[slug].astro generates 121 pages
└── styles/global.css    # Tailwind 4 theme tokens (light + dark)
```

Gallery thumbnails are real `<a>` links so the site works without JS and every painting URL is independently crawlable. The lightbox is the only meaningful client-side interactivity.

## Deployment

Pushes to `master` trigger a Netlify build. Build config lives in `netlify.toml`; Netlify dashboard build settings should be empty so the file is the source of truth.

## Documentation

- [`CLAUDE.md`](./CLAUDE.md) — project context for AI sessions, including non-obvious gotchas
- [`docs/superpowers/specs/2026-05-15-gatsby-to-astro-rewrite-design.md`](./docs/superpowers/specs/2026-05-15-gatsby-to-astro-rewrite-design.md) — full design spec
- [`docs/superpowers/plans/2026-05-15-gatsby-to-astro-rewrite.md`](./docs/superpowers/plans/2026-05-15-gatsby-to-astro-rewrite.md) — implementation plan

## License

Code and configuration: [MIT](./LICENSE).
Paintings under `src/assets/paintings/` and their build-pipeline derivatives: © Joe Passmore, all rights reserved. See [NOTICE](./NOTICE).
