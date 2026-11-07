# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project

Personal portfolio site (Chenchen Feng) — React 19 + TypeScript + Vite SPA, deployed on Vercel at `https://www.fengchenchen.top`. The production origin and default share image are defined in `src/siteConfig.ts`.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc`) then build to `dist`, including initial HTML metadata, `robots.txt`, and `sitemap.xml`
- `npm run check:content` — run content, route, metadata, image-loading, and crawl checks after building; `npm run check:content -- meta` runs the focused metadata checks. There is no browser test suite or ESLint config yet.
- `npm run preview` — serve the production build locally

## Architecture

**Routing & Vercel deployment.** Paths, navigation labels, and bilingual metadata live in `src/routeManifest.ts`; `src/router.tsx` maps them to pages under `SiteShell` (`src/components/layout/SiteShell.tsx`), which provides the nav/footer layout via `<Outlet>`. The router `basename` comes from `import.meta.env.BASE_URL`, set by `VITE_BASE_URL` in `vite.config.ts`; production uses `/`. Vercel runs `npm run build` and serves `dist`. `vercel.json` rewrites only application deep links to `/index.html`, leaving missing static assets as HTTP 404. Keep these rewrites aligned with the route manifest. The GitHub Pages redirect scripts and CNAME file are removed. `scripts/site-crawl.ts` generates crawl files from the route manifest, note catalog, and shared origin. Vite preview does not validate Vercel rewrites; verify deployed routes and static HTTP responses separately.

**Bilingual content model.** All site copy lives as TypeScript data in `src/content/` (profile, publications, projects, memory, siteText, links), typed by `src/types/content.ts`. Every content module exports a `Record<Locale, ...>` keyed by `"en" | "zh"`. Pages read the active locale from `useLanguage()` (`src/i18n.tsx` — context provider that persists the choice to localStorage and auto-detects Chinese from `navigator.language`). When adding or editing content, always update both the `en` and `zh` entries.

**Memory notes.** Bilingual entries in `src/content/memoryNotes.ts` feed `src/content/memoryCatalog.ts`, which derives cards and details by slug. Each detail points to markdown under `public/notes/`; its card image is also its share image. `MemoryDetailPage` fetches markdown at runtime and uses `src/lib/noteMarkdown.ts` (front matter, comments, headings, paragraphs, images, emphasis, and dividers). There is no markdown library; extend the parser if new syntax is needed.

**Per-page metadata & analytics.** Pages call `useDocumentMeta({ route, params?, ...overrides })` to set the title, description, canonical link, Open Graph, and Twitter tags from the route catalog and active locale. Canonical and share URLs use `src/siteConfig.ts`, including on preview hosts; query/hash are excluded from the default canonical path. Vite's `transformIndexHtml` injects English home metadata into the initial SPA HTML using the same catalog/configuration. Route-specific and translated metadata updates in the browser; there is no prerendering. Keep default/article share assets present under `public/`. The footer visit counter (`useVisitCounter`) calls an external counter API and deliberately no-ops on localhost.

**Styling.** SCSS throughout: one global stylesheet (`src/styles/global.scss`) plus co-located CSS modules (`*.module.scss`) next to components. The visual system is a light "premium editorial" design: warm paper background, Manrope body and display sans-serif, Name Sans SC for the greeting, IBM Plex Mono for structural labels, hairline rules instead of card boxes, near-sharp corners (`--radius: 2px`), no shadows or backdrop blur. Preserve the two research columns and accepted bilingual layout. All design tokens (colors, type scale, spacing, motion easings) are CSS custom properties at the top of `global.scss` — change tokens there rather than hard-coding values. Animations are pure CSS + the `Reveal` component (IntersectionObserver; supports `variant`, `stagger`, and `as` props) and must respect `prefers-reduced-motion`.
