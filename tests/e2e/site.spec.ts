import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test as base, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { getMemoryDetail, listMemory } from "../../src/content/memoryCatalog";
import { profilesByLocale } from "../../src/content/profile";
import { siteText } from "../../src/content/siteText";
import { getRouteLabel, getRouteMeta, primaryRouteIds, routeManifest } from "../../src/routeManifest";
import type { RouteId } from "../../src/routeManifest";
import type { Locale } from "../../src/i18n";
import { siteConfig } from "../../src/siteConfig";
import { parseNoteMarkdown } from "../../src/lib/noteMarkdown";
import { getImageMetadata } from "../../src/lib/responsiveImages";

const test = base.extend({
  page: async ({ page, context, baseURL }, use) => {
    const errors: string[] = [];
    const externalRequests: string[] = [];
    const localFailures: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (new URL(response.url()).origin === baseURL && response.status() >= 400) {
        localFailures.push(`${response.status()} ${response.url()}`);
      }
    });
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.protocol === "http:" || url.protocol === "https:") {
        if (url.origin !== baseURL) {
          externalRequests.push(url.href);
          await route.abort("blockedbyclient");
          return;
        }
      }
      await route.continue();
    });
    await use(page);
    expect(errors, "uncaught browser errors").toEqual([]);
    expect(localFailures, "failed local resources").toEqual([]);
    expect(externalRequests, "smoke tests must work entirely offline after installation").toEqual([]);
  },
});

async function expectLocale(page: Page, locale: Locale) {
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  await expect(page.getByRole("navigation", { name: siteText[locale].primaryNavigationLabel, exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "EN", exact: true })).toHaveAttribute("aria-pressed", String(locale === "en"));
  await expect(page.getByRole("button", { name: "中文", exact: true })).toHaveAttribute("aria-pressed", String(locale === "zh"));
  await expect.poll(() => page.evaluate(() => localStorage.getItem("fcc-web-locale"))).toBe(locale);
}

async function selectLocale(page: Page, locale: Locale) {
  const button = page.getByRole("button", { name: locale === "en" ? "EN" : "中文", exact: true });
  await button.focus();
  await button.press("Enter");
  await expect(button).toBeFocused();
  await expectLocale(page, locale);
}

async function expectMetadata(page: Page, route: RouteId, locale: Locale, slug?: string) {
  const meta = getRouteMeta(route, locale, slug ? { slug } : undefined);
  const canonical = new URL(new URL(page.url()).pathname, siteConfig.origin).href;
  const image = new URL(meta.image ?? siteConfig.defaultImage, siteConfig.origin).href;
  await expect(page).toHaveTitle(meta.title);
  const tags = {
    'meta[name="description"]': meta.description,
    'meta[property="og:title"]': meta.title,
    'meta[property="og:description"]': meta.description,
    'meta[property="og:type"]': meta.type ?? "website",
    'meta[property="og:url"]': canonical,
    'meta[property="og:image"]': image,
    'meta[name="twitter:card"]': "summary_large_image",
    'meta[name="twitter:title"]': meta.title,
    'meta[name="twitter:description"]': meta.description,
    'meta[name="twitter:image"]': image,
  };
  for (const [selector, value] of Object.entries(tags)) {
    await expect(page.locator(selector)).toHaveCount(1);
    await expect(page.locator(selector)).toHaveAttribute("content", value);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
}

async function expectLoadedImage(image: Locator) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
}

async function expectHeadingOrder(page: Page) {
  const headings = page.locator("main h1, main h2, main h3, main h4, main h5, main h6");
  const levels = await headings.evaluateAll((elements) => elements.map((element) => Number(element.tagName.slice(1))));
  expect(levels[0]).toBe(1);
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  for (let index = 1; index < levels.length; index++) expect(levels[index]).toBeLessThanOrEqual(levels[index - 1] + 1);
}

for (const locale of ["en", "zh"] as const) {
  test.describe(locale, () => {
    test.use({ locale: locale === "zh" ? "zh-CN" : "en-US" });

    for (const route of primaryRouteIds) {
      test(`${route}: direct entry, localized content, metadata and refresh`, async ({ page }) => {
        const path = routeManifest[route].path;
        const url = `${path}?smoke=refresh#main-content`;
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await expectLocale(page, locale);
        const heading = route === "home" ? profilesByLocale[locale].heroTitle.replace(/\n|。|\.$/g, "") : siteText[locale][route].title;
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
        await expectMetadata(page, route, locale);
        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(`http://127.0.0.1:4187${url}`);
        await expectLocale(page, locale);
        await expectMetadata(page, route, locale);

        if (route === "home" || route === "cv") await expectHeadingOrder(page);
        if (route === "memory") {
          const images = page.locator("main article img");
          await expect(images).toHaveCount(listMemory(locale).length);
          for (let index = 0; index < listMemory(locale).length; index++) {
            const image = images.nth(index);
            await expect(image).toHaveAttribute("loading", index === 0 ? "eager" : "lazy");
            await expect(image).toHaveAttribute("decoding", "async");
            await expect(image).toHaveAttribute("srcset", /\.webp \d+w/);
            await expectLoadedImage(image);
          }
        }
      });
    }

    test("CV download contains the current PDF and viewer remains reachable", async ({ page }) => {
      await page.goto("/cv", { waitUntil: "domcontentloaded" });
      await expectLocale(page, locale);
      const link = page.getByRole("link", { name: siteText[locale].cv.download, exact: true });
      const downloadEvent = page.waitForEvent("download");
      await link.click();
      const download = await downloadEvent;
      expect(download.suggestedFilename()).toBe("Chenchen-Feng-CV.pdf");
      expect(await download.failure()).toBeNull();
      const downloadedPath = await download.path();
      expect(downloadedPath).not.toBeNull();
      expect(readFileSync(downloadedPath!)).toEqual(readFileSync("public/docs/resume.pdf"));
      const viewer = page.locator("iframe");
      await expect(viewer).toHaveAttribute("title", siteText[locale].cv.pdfTitle);
      await expect(viewer).toHaveAttribute("loading", "lazy");
      await expect(viewer).toHaveAttribute("src", "/docs/resume.pdf");
      await viewer.scrollIntoViewIfNeeded();
      await expect(viewer).toBeVisible();
      // The native PDF viewer UI varies by browser; check its resource separately.
      const pdf = await page.request.get("/docs/resume.pdf");
      expect(pdf.ok()).toBe(true);
      expect(pdf.headers()["content-type"]).toContain("application/pdf");
      expect(await pdf.body()).toEqual(readFileSync("public/docs/resume.pdf"));
    });
  });
}

test("keyboard language switch persists across client navigation and reload", async ({ page }) => {
  await page.goto("/projects?locale=persist#main-content", { waitUntil: "domcontentloaded" });
  await expectLocale(page, "en");
  await selectLocale(page, "zh");
  await expect(page).toHaveURL("http://127.0.0.1:4187/projects?locale=persist#main-content");
  await expectMetadata(page, "projects", "zh");
  // Visit every primary page through the actual SPA navigation.
  for (const route of primaryRouteIds) {
    await page.getByRole("navigation").getByRole("link", { name: getRouteLabel(route, "zh"), exact: true }).click();
    await expect(page).toHaveURL(`http://127.0.0.1:4187${routeManifest[route].path}`);
    await expectLocale(page, "zh");
    await expectMetadata(page, route, "zh");
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectLocale(page, "zh");
  await expectMetadata(page, "memory", "zh");
  await selectLocale(page, "en");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectLocale(page, "en");
  await expectMetadata(page, "memory", "en");
});

for (const entry of listMemory("en")) {
  if (!getMemoryDetail("en", entry.slug)) continue;
  test(`note ${entry.slug}: exact localized body, same-slug switch and image loading`, async ({ page }) => {
    const url = `/memory/${encodeURIComponent(entry.slug)}?note=switch#main-content`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    for (const locale of ["en", "zh"] as const) {
      if (locale === "zh") await selectLocale(page, locale);
      const detail = getMemoryDetail(locale, entry.slug)!;
      const blocks = parseNoteMarkdown(readFileSync(join("public", detail.contentPath), "utf8"), { assetBasePath: detail.assetBasePath });
      const textBlocks = blocks.flatMap((block) => block.type === "heading" ? [block.text] : block.type === "paragraph" ? [block.content.map((part) => part.text).join("")] : []);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(detail.title);
      // Full ordered text comparison catches mixed-language or stale bodies, not
      // merely the presence of one translated heading.
      await expect(page.locator("article h2, article p")).toHaveText(textBlocks);
      await expectMetadata(page, "memoryDetail", locale, entry.slug);
      await expect(page).toHaveURL(`http://127.0.0.1:4187${url}`);
      const images = blocks.filter((block) => block.type === "image");
      await expect(page.locator("article img")).toHaveCount(images.length);
      for (const [index, block] of images.entries()) {
        const image = page.locator("article img").nth(index);
        const dimensions = getImageMetadata(block.src)!;
        await expect(image).toHaveAttribute("src", block.src);
        await expect(image).toHaveAttribute("width", String(dimensions.width));
        await expect(image).toHaveAttribute("height", String(dimensions.height));
        await expect(image).toHaveAttribute("loading", "lazy");
        await expect(image).toHaveAttribute("decoding", "async");
        await expectLoadedImage(image);
      }
    }
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectLocale(page, "zh");
    await expectMetadata(page, "memoryDetail", "zh", entry.slug);
    // CSS adds a decorative arrow to the accessible name; match the localized label.
    await page.getByRole("main").getByRole("link", { name: siteText.zh.memory.backToList }).click();
    await expect(page).toHaveURL("http://127.0.0.1:4187/memory");
    await expectMetadata(page, "memory", "zh");
    // Re-enter through the rendered card to exercise client-side note routing.
    await page.getByRole("link").filter({ has: page.getByRole("heading", { level: 2, name: getMemoryDetail("zh", entry.slug)!.title, exact: true }) }).click();
    await expect(page).toHaveURL(`http://127.0.0.1:4187/memory/${encodeURIComponent(entry.slug)}`);
    await expectMetadata(page, "memoryDetail", "zh", entry.slug);
  });
}
