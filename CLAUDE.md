# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site (Chenchen Feng) — React 19 + TypeScript + Vite SPA, deployed to GitHub Pages under the custom domain `starquake.top` (see `public/CNAME`).

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc`) then build; `tsc` is the only lint/check step, there is no test suite or ESLint config
- `npm run preview` — serve the production build locally

## Architecture

**Routing & GitHub Pages SPA trick.** Routes are defined in `src/router.tsx` (react-router v7 `createBrowserRouter`), all nested under `SiteShell` (`src/components/layout/SiteShell.tsx`), which provides the nav/footer layout via `<Outlet>`. The router `basename` comes from `import.meta.env.BASE_URL`, which is set by the `VITE_BASE_URL` env var in `vite.config.ts`. Deep links work on GitHub Pages through a redirect pair: `public/404.html` encodes the requested path into `/?p=...&q=...&h=...`, and an inline script in `index.html` decodes it back with `history.replaceState` before React mounts. If you change routing, keep both scripts consistent.

**Bilingual content model.** All site copy lives as TypeScript data in `src/content/` (profile, publications, projects, memory, siteText, links), typed by `src/types/content.ts`. Every content module exports a `Record<Locale, ...>` keyed by `"en" | "zh"`. Pages read the active locale from `useLanguage()` (`src/i18n.tsx` — context provider that persists the choice to localStorage and auto-detects Chinese from `navigator.language`). When adding or editing content, always update both the `en` and `zh` entries.

**Memory notes.** The memory section is a two-level structure: card entries in `src/content/memory.ts` and detail metadata in `src/content/memoryDetails.ts`, where each detail points to a markdown file under `public/notes/`. `MemoryDetailPage` fetches that markdown at runtime and renders it with its own minimal hand-rolled parser (front-matter stripping, paragraphs, images, emphasis) — there is no markdown library; extend the parser if new syntax is needed.

**Per-page metadata & analytics.** Pages call `useDocumentMeta(title, description)` to set `document.title` and meta/og tags. The footer visit counter (`useVisitCounter`) calls an external counter API and deliberately no-ops on localhost.

**Styling.** SCSS throughout: one global stylesheet (`src/styles/global.scss`) plus co-located CSS modules (`*.module.scss`) next to components. The visual system is a light "premium editorial" design: warm paper background, Fraunces display serif + Manrope body + IBM Plex Mono for structural labels, hairline rules instead of card boxes, near-sharp corners (`--radius: 2px`), no shadows or backdrop blur. All design tokens (colors, type scale, spacing, motion easings) are CSS custom properties at the top of `global.scss` — change tokens there rather than hard-coding values. Animations are pure CSS + the `Reveal` component (IntersectionObserver; supports `variant`, `stagger`, and `as` props) and must respect `prefers-reduced-motion`.
