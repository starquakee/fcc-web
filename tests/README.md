# Site validation

Use Node 22 and the committed lockfile:

```sh
npm ci
npx playwright install chromium
npm run check:images
npm run build
npm run check:content
npm run test:e2e
```

On Linux CI, `npx playwright install --with-deps chromium` installs browser system dependencies too. If the default Windows npm cache is inaccessible, pass `--cache .npm-cache.local` to the install command. Reports, downloads, and temporary caches must stay untracked.

`npm run build` type-checks both app code and the scripts/Playwright suite. Content checks inspect route/catalog data, locale parity, actual PDF/image/Markdown files, source-to-build equality, initial HTML metadata, responsive image geometry and generated crawl files. `npm run check:content -- fixtures` exercises positive controls and rejects deliberately missing source/build resources, wrong-origin metadata URLs, canonical queries, and missing/empty translations. Fixtures use temporary files and in-memory values; tracked content is never changed.

The 32 browser cases run at desktop and mobile viewport sizes. They cover all primary routes in English and Chinese, direct entry/refresh with query and hash, full runtime metadata, keyboard language switching and persistence through SPA navigation/reload, CV/home heading order, actual CV download bytes and filename, lazy PDF iframe markup/resource, note cover loading, and all localized note bodies/images. Notes are compared against the complete ordered parsed body, so an old or mixed-language response cannot pass just by containing one translated phrase.

Playwright launches `vite preview` on `127.0.0.1:4187` with a strict port and refuses to reuse any existing server. Always build first: tests consume `dist`, not Vite's development server. External page requests are blocked and reported as failures; the local visit counter is already disabled. Reduced motion removes animation timing from smoke assertions. No public-site access is needed during the tests.

`node node_modules/@playwright/test/cli.js test --list` checks discovery without launching a server/browser. This direct form also avoids Windows npm wrapper argument-forwarding issues. Failures retain a trace, screenshot, and HTML report under ignored `test-results/` and `playwright-report/`; CI uploads these for seven days. Browser installation and test execution are separate steps.

The smoke suite does not prove Vercel rewrites, production HTTP status/MIME behavior, native PDF viewer controls, visual approval, or Lighthouse performance. The supervisor verifies these against the matching deployed commit, including missing `/media/` and `/docs/` resources returning real HTTP 404. Vite preview has a universal SPA fallback. GitHub CI success and production validation must be recorded separately. The dependency audit gate is deferred to US-007.
