# PRD: Portfolio audit fixes

## Introduction

Repair the confirmed audit findings in the existing React/TypeScript/Vite portfolio. The approved production origin is https://www.fengchenchen.top. Execute original audit items 1, 2, 3, 5, 6, 7, and 8 in that order, with an independently validated commit and push for each item.

## References

- Root AGENTS.md and the current source code.
- src/routeManifest.ts, src/content/memoryCatalog.ts, src/hooks/useDocumentMeta.ts.
- src/pages/MemoryDetailPage.tsx, src/components/ui/TimelineSection.tsx, scripts/check-site-content.ts.
- https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas
- Ralph execution checklist: root prd.json; durable evidence: progress.txt.

## Decisions

- Use the clean codex/site-audit-fixes worktree. Publish each accepted fix with a normal fast-forward push of HEAD to origin/main. Never force-push.
- Keep the existing SPA, routes, navigation labels, visual design, sans-serif typography, two research columns, reduced motion support, and bilingual content.
- Canonical production origin is https://www.fengchenchen.top. Do not change DNS or the separate old website.
- Original issue 4 (project evidence links) is deferred because corresponding public artifacts were not established. Do not invent links or add project detail pages.
- Run one story per fresh Codex CLI invocation with workspace-write sandbox and approval review; never use --unsafe.
- The supervising session owns browser verification, commits, pushes, and production verification. A worker leaves passes=false until required release evidence exists.
- A fix may be pushed with its story awaiting production verification. Commit the passing checklist/evidence separately after release verification, before starting another story.
- Do not start a later story while the current story fails validation or deployment. Record blockers honestly.

## Goals

- Existing public deep links respond successfully without the GitHub Pages JavaScript-404 workaround on Vercel.
- Canonical/share/crawl URLs consistently point at the approved domain and valid assets.
- Reduce transferred image bytes and reserve article image geometry.
- Display the selected language's article body and make CV download/heading semantics correct.
- Replace source-text assertions with meaningful data/browser checks and automate them.
- Resolve fixable dependency audit findings without a React, React Router, or Vite major migration.

## Non-Goals

No framework migration, SSR, site-wide prerendering, new project pages, DNS changes, old-site changes, broad redesign, or unrelated user file changes. Never commit .agents/, credentials, validation logs, caches, temporary homes, or browser reports.

## User Stories

### US-001: Vercel deep links and crawler files (audit 1)
Configure rewrites for application routes without swallowing missing static assets. Add a pure shared site configuration and build-time generation of robots.txt and sitemap.xml using existing routes and note slugs. The sitemap uses the approved origin; URL encoding must be correct and wildcard routes excluded.

Acceptance: build and content checks pass; production primary routes and all current notes return 200; query/hash survive navigation/refresh; PDF/images have correct types; missing /media/ and /docs/ files remain HTTP 404; robots and sitemap return 200 with correct types and URLs.

### US-002: Canonical domain and share metadata (audit 2)
Use shared configuration in runtime metadata and initial HTML. Default and article share images must exist at the new origin. Update the obsolete hard-coded old-domain check and deployment documentation to reflect Vercel and current code. Use a single source of truth; do not add prerendering.

Acceptance: build/content checks pass; built HTML and browser canonical/share metadata use the approved origin, including after navigation and language switch; share image HTTP responses are images; no old-domain canonical/share references in build output. Keep necessary specific checks passing now rather than deferring fixes to US-006.

### US-003: Responsive images and stable article geometry (audit 3)
Add a reproducible Node image optimization script using a maintained image tool. Preserve original images. Generate WebP variants without upscaling and typed image metadata. Apply responsive variants to note covers, portrait, and large institution logos. Resolve article image dimensions against the existing asset-base path and reserve correct aspect ratios before lazy images load.

Acceptance: first note cover's largest served WebP is <=100 KB; responsive loading avoids oversize downloads; images retain aspect ratio and acceptable quality on mobile/desktop and in both locales; article images have width/height before load. Build/content checks pass. Compare 3-run mobile Lighthouse medians on the notes page using unchanged settings before and after; save measurements outside tracked source. Do not claim a performance win from a single run or sacrifice layout/visual quality for score.

### US-004: Separate bilingual note bodies (audit 5)
Split public/notes/henpri.md at its existing language boundary into English and Chinese documents. Preserve each language's prose and image order. Remove only the obsolete bilingual preface; update locale content references without changing the article route.

Acceptance: build/content checks pass; Chinese and English readers each see only their respective article body; switching language stays on the same slug; all referenced images load; source-to-split comparison confirms no prose or images were dropped unintentionally.

### US-005: CV and language accessibility (audit 6)
Make experience/education group labels h2 and retain positions as h3, preserving styling. Make the CV download link download the existing same-origin PDF with a meaningful filename. Lazy-load the below-fold PDF viewer. Add aria-pressed to the language buttons and localized navigation landmark names through bilingual site content.

Acceptance: build/content checks pass; no heading-level skip on CV or home; browser download receives the current PDF; embedded viewer remains usable; keyboard and accessibility tree identify the selected language; mobile/desktop layout is unchanged apart from necessary corrections.

### US-006: Behavioral validation and CI (audit 7)
Replace brittle source-includes checks with checks on route/content/metadata data, real local asset existence, locale parity, generated outputs, and executable behavior. Add Playwright production-build smoke tests for primary routes, language persistence/switching, CV download, and localized note content. Add GitHub Actions for clean install/build/content/browser checks. Audit gates are introduced only after US-007 removes current findings.

Acceptance: npm run build, npm run check:content, and npm run test:e2e pass; tests demonstrate failures for missing resource/wrong-origin fixture input without editing tracked content; CI passes on GitHub; no external sites required for deterministic browser tests; missing static resources and live rewrites are separately production-verified. Avoid using Vite's universal dev fallback as proof of Vercel routing.

### US-007: Controlled dependency updates (audit 8)
Update compatible fixed versions and the lockfile. Keep React 19, React Router 7, and Vite 7. A necessary compatible update of standalone build tools (including esbuild) is allowed. Review each audit entry, including build-only paths; do not hide vulnerabilities using severity filters or unjustified overrides. Add an audit gate to CI once the fixable findings are resolved.

Acceptance: clean npm install/build/content/browser tests and live smoke checks pass; npm audit findings are resolved where compatible fixes exist. Stop and leave this story failing if eliminating remaining findings requires a React/Router/Vite major migration; document the specific blocker. Never automatically apply audit fix --force.

## Functional Requirements

- Shared site configuration and image metadata are the only new content interfaces; existing content consumers remain compatible.
- Static URL generation and runtime metadata must use the same origin.
- All visible copy changes update en and zh, except splitting their existing source documents.
- Each story is independently validated and released in priority order.

## Validation

Every story: npm run build; npm run check:content; git diff --check. Add focused checks and browser/production checks specified above. From US-006 onward also run npm run test:e2e. Inspect pushed commit SHA and the corresponding Vercel deployment, then actual public HTTP/browser behavior. Final aggregate validation includes all checks, audit, GitHub CI, and production routes/assets.

## Risks and Stop Conditions

Existing working tree has unrelated untracked .agents/; the clean worktree must not include it. Windows sandbox restrictions can prevent esbuild resolution or Git/network actions; request reviewed execution through the supervising session instead of disabling safeguards. The naked domain's DNS is outside scope. Any failed validation/deployment/push stops advancement. Revert via a new commit if release recovery is needed. Do not mark checklist items complete merely because implementation or a local build succeeded.
