import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseNoteMarkdown } from "../src/lib/noteMarkdown";
import { getImageMetadata, getResponsiveImageProps, imageSizes } from "../src/lib/responsiveImages";
import { imageMetadata } from "../src/generated/imageMetadata";
import { getMemoryDetail, listMemory } from "../src/content/memoryCatalog";
import { profilesByLocale } from "../src/content/profile";
import { siteText } from "../src/content/siteText";
import { getRouteMeta, primaryRouteIds, routeManifest } from "../src/routeManifest";
import { siteConfig } from "../src/siteConfig";
import { createCrawlFiles, getCrawlPaths } from "./site-crawl";

function checkCrawlFiles() {
  const paths = getCrawlPaths();
  assert(new Set(paths).size === paths.length, "crawl paths should be unique across locales");
  assert(paths.every((path) => !/[:*]/.test(path)), "crawl paths must not contain route patterns");
  for (const routeId of primaryRouteIds) {
    assert(paths.includes(routeManifest[routeId].path), `${routeId} should be crawlable`);
  }
  for (const locale of ["en", "zh"] as const) {
    for (const entry of listMemory(locale)) {
      if (getMemoryDetail(locale, entry.slug)) {
        assert(paths.includes(`/memory/${encodeURIComponent(entry.slug)}`), `${locale}/${entry.slug} should be crawlable`);
      }
    }
  }

  const files = createCrawlFiles();
  for (const [fileName, expected] of Object.entries(files)) {
    assert(readFileSync(join("dist", fileName), "utf8") === expected, `build should emit current ${fileName}; run npm run build first`);
  }
  const locations = [...files["sitemap.xml"].matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert(locations.length === paths.length, "sitemap should include every crawl path exactly once");
  assert(locations.every((url) => new URL(url).origin === siteConfig.origin), "sitemap should use the approved origin");
  assert(files["robots.txt"].includes(`Sitemap: ${siteConfig.origin}/sitemap.xml`), "robots should advertise the sitemap");
  const encodedPath = `/memory/${encodeURIComponent("中文 & /?#%")}`;
  assert(
    createCrawlFiles([encodedPath])["sitemap.xml"].includes(`${siteConfig.origin}${encodedPath}`),
    "sitemap should preserve encoded slug characters without double encoding",
  );
  assert(createCrawlFiles(["/a?x=1&y=2"])["sitemap.xml"].includes("?x=1&amp;y=2"), "sitemap URLs should be XML escaped");
  for (const invalid of ["*", "/memory/:slug", "//example.com/path"]) {
    let rejected = false;
    try { createCrawlFiles([invalid]); } catch { rejected = true; }
    assert(rejected, `crawl generation should reject ${invalid}`);
  }

  const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
    rewrites: Array<{ source: string; destination: string }>;
  };
  const applicationPaths = Object.values(routeManifest).map((route) => route.path).filter((path) => path !== "/" && path !== "*");
  assert(config.rewrites.length === applicationPaths.length, "rewrites should cover only application routes");
  for (const path of applicationPaths) {
    assert(
      config.rewrites.some((rule) => rule.source === path && rule.destination === "/index.html"),
      `Vercel should internally rewrite ${path} to the SPA`,
    );
  }
  assert(!existsSync("dist/404.html"), "build should not ship the GitHub Pages redirect document");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function checkNoteMarkdownParsing() {
  const blocks = parseNoteMarkdown(
    [
      "---",
      "title: Test",
      "---",
      "[//]: # (comment)",
      "### Heading",
      "",
      "A paragraph with *emphasis*.",
      "",
      "![Local](./image.png)",
      "![Absolute](/media/existing.png)",
      "------",
    ].join("\n"),
    { assetBasePath: "/media/notes/sample" },
  );

  assert(blocks[0]?.type === "heading" && blocks[0].text === "Heading", "heading block should parse after front matter");
  assert(blocks[1]?.type === "paragraph", "paragraph block should parse");
  assert(
    blocks[1]?.type === "paragraph" && blocks[1].content.some((part) => part.type === "emphasis" && part.text === "emphasis"),
    "inline emphasis should parse inside paragraphs",
  );
  assert(
    blocks[2]?.type === "image" && blocks[2].src === "/media/notes/sample/image.png",
    "relative markdown image should resolve against note asset base path",
  );
  assert(
    blocks[3]?.type === "image" && blocks[3].src === "/media/existing.png",
    "absolute markdown image should stay absolute",
  );
  assert(blocks[4]?.type === "divider", "six hyphens should parse as divider");
}

function checkMemoryContentIntegrity() {
  for (const locale of ["en", "zh"] as const) {
    const entries = listMemory(locale);
    const entrySlugs = new Set(entries.map((entry) => entry.slug));

    assert(entrySlugs.size === entries.length, `${locale} memory entries should not contain duplicate slugs`);

    for (const entry of entries) {
      const detail = getMemoryDetail(locale, entry.slug);

      if (!detail) {
        continue;
      }

      assert(detail.contentPath.startsWith("/notes/"), `${locale} detail ${detail.slug} should load from /notes`);
      assert(
        existsSync(join("public", detail.contentPath)),
        `${locale} detail ${detail.slug} should point to an existing markdown file`,
      );
    }
  }
}

function checkRouteManifest() {
  const paths = Object.values(routeManifest).map((route) => route.path);

  assert(new Set(paths).size === paths.length, "route manifest should not contain duplicate paths");

  for (const routeId of primaryRouteIds) {
    assert(routeManifest[routeId].navLabel?.en, `${routeId} should have an English navigation label`);
    assert(routeManifest[routeId].navLabel?.zh, `${routeId} should have a Chinese navigation label`);
  }

  for (const locale of ["en", "zh"] as const) {
    for (const routeId of Object.keys(routeManifest) as Array<keyof typeof routeManifest>) {
      const meta = getRouteMeta(routeId, locale);
      assert(meta.title && meta.description, `${routeId} should have ${locale} metadata`);
    }
  }
}

function checkSiteTextShape() {
  for (const locale of ["en", "zh"] as const) {
    assert(!("brandNote" in siteText[locale]), `${locale} siteText should not keep unused brandNote`);
    assert(!("openDocument" in siteText[locale].common), `${locale} common text should not keep unused openDocument`);
    assert(!("openPdf" in siteText[locale].common), `${locale} common text should not keep unused openPdf`);
    assert(!("selectedWorkBody" in siteText[locale].home), `${locale} home text should not keep unused selectedWorkBody`);
    assert(!("noteBody" in siteText[locale].publications), `${locale} publications text should not keep unused noteBody`);
    assert(!("role" in profilesByLocale[locale]), `${locale} profile should not keep unused role`);
  }
}

function checkDocumentMetaShape() {
  const hookSource = readFileSync("src/hooks/useDocumentMeta.ts", "utf8");
  const builtHtml = readFileSync("dist/index.html", "utf8");

  assert(hookSource.includes("DocumentMetaOptions"), "useDocumentMeta should expose an object options interface");
  assert(hookSource.includes('meta[property="og:image"]'), "useDocumentMeta should update og:image");
  assert(hookSource.includes('meta[property="og:url"]'), "useDocumentMeta should update og:url");
  assert(hookSource.includes('meta[name="twitter:card"]'), "useDocumentMeta should update twitter:card");
  assert(hookSource.includes('link[rel="canonical"]'), "useDocumentMeta should update canonical link");

  function readHeadUrl(tag: "meta" | "link", key: string, value: string, attribute: string) {
    const tags = [...builtHtml.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))];
    const matches = tags.filter(([markup]) => markup.includes(`${key}="${value}"`));
    assert(matches.length === 1, `built HTML should have exactly one ${value} tag`);
    return matches[0][0].match(new RegExp(`${attribute}="([^"]*)"`))?.[1];
  }

  const homeUrl = new URL(routeManifest.home.path, siteConfig.origin).href;
  const homeMeta = getRouteMeta("home", "en");
  const defaultImageUrl = new URL(homeMeta.image ?? siteConfig.defaultImage, siteConfig.origin).href;
  assert(readHeadUrl("link", "rel", "canonical", "href") === homeUrl, "initial canonical should use the approved origin");
  assert(readHeadUrl("meta", "property", "og:url", "content") === homeUrl, "initial og:url should match canonical");
  assert(readHeadUrl("meta", "property", "og:image", "content") === defaultImageUrl, "initial og:image should use the shared default");
  assert(readHeadUrl("meta", "name", "twitter:image", "content") === defaultImageUrl, "initial Twitter image should match og:image");
  assert(readHeadUrl("meta", "name", "twitter:card", "content") === "summary_large_image", "initial Twitter card should be present");
  assert(builtHtml.includes(`<title>${homeMeta.title}</title>`), "initial title should come from the home route metadata");

  const imagePaths = new Set<string>([siteConfig.defaultImage]);
  for (const locale of ["en", "zh"] as const) {
    for (const routeId of Object.keys(routeManifest) as Array<keyof typeof routeManifest>) {
      imagePaths.add(getRouteMeta(routeId, locale).image ?? siteConfig.defaultImage);
    }
    for (const entry of listMemory(locale)) {
      if (!getMemoryDetail(locale, entry.slug)) continue;
      const meta = getRouteMeta("memoryDetail", locale, { slug: entry.slug });
      assert(meta.type === "article", `${locale}/${entry.slug} should have article metadata`);
      assert(meta.image === entry.image, `${locale}/${entry.slug} should use its note cover for sharing`);
      imagePaths.add(meta.image ?? siteConfig.defaultImage);
    }
  }
  for (const imagePath of imagePaths) {
    const url = new URL(imagePath, siteConfig.origin);
    assert(url.origin === siteConfig.origin, `share image should use the approved origin: ${imagePath}`);
    const assetPath = decodeURIComponent(url.pathname);
    const original = readFileSync(join("public", assetPath));
    const built = readFileSync(join("dist", assetPath));
    const isJpeg = original.subarray(0, 3).toString("hex") === "ffd8ff";
    const isPng = original.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    const isWebp = original.toString("ascii", 0, 4) === "RIFF" && original.toString("ascii", 8, 12) === "WEBP";
    assert(isJpeg || isPng || isWebp, `share asset should contain image bytes: ${imagePath}`);
    assert(original.equals(built), `build should preserve the share image: ${imagePath}`);
  }

  const bundleFiles = readdirSync("dist/assets").filter((file) => file.endsWith(".js"));
  assert(bundleFiles.length > 0, "metadata checks require a built application bundle");
  for (const file of ["dist/index.html", ...bundleFiles.map((file) => join("dist/assets", file))]) {
    assert(!readFileSync(file, "utf8").includes("starquake.top"), `${file} should not contain the obsolete metadata origin`);
  }
  console.log(`Metadata checks passed: initial HTML, both locales, ${imagePaths.size} share images, and built origin references.`);
}

function checkImageLoadingShape() {
  const memoryPageSource = readFileSync("src/pages/MemoryPage.tsx", "utf8");
  const memoryDetailSource = readFileSync("src/pages/MemoryDetailPage.tsx", "utf8");

  assert(memoryPageSource.includes('loading={index === 0 ? "eager" : "lazy"}'), "memory list images should lazy-load after the first item");
  assert(memoryPageSource.includes('decoding="async"'), "memory list images should decode asynchronously");
  assert(memoryDetailSource.includes('loading="lazy"'), "note article images should lazy-load");
  assert(memoryDetailSource.includes('decoding="async"'), "note detail images should decode asynchronously");
}

function checkResponsiveImages() {
  let variantCount = 0;
  for (const [src, metadata] of Object.entries(imageMetadata)) {
    assert(existsSync(join("public", src)), `image metadata should refer to a preserved original: ${src}`);
    assert(metadata.width > 0 && metadata.height > 0, `image dimensions should be positive: ${src}`);
    let previousWidth = 0;
    for (const variant of metadata.variants ?? []) {
      assert(variant.width > previousWidth, `responsive widths should be unique and increasing: ${src}`);
      assert(variant.width <= metadata.width && variant.height <= metadata.height, `variant should not upscale: ${src}`);
      assert(Math.abs(variant.height - metadata.height * variant.width / metadata.width) <= 1, `variant should preserve aspect ratio: ${src}`);
      const data = readFileSync(join("public", variant.src));
      assert(data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP", `variant should contain WebP bytes: ${variant.src}`);
      assert(data.length === variant.bytes, `variant byte count should match metadata: ${variant.src}`);
      assert(data.equals(readFileSync(join("dist", variant.src))), `build should contain current variant: ${variant.src}`);
      previousWidth = variant.width;
      variantCount++;
    }
  }

  function checkResponsiveSource(src: string, sizes: string) {
    const metadata = getImageMetadata(src);
    assert(metadata?.variants?.length, `responsive source should have variants: ${src}`);
    const props = getResponsiveImageProps(src, sizes);
    assert(props.width === metadata.width && props.height === metadata.height, `responsive image should reserve original geometry: ${src}`);
    assert(metadata.variants.some((variant) => variant.src === props.src), `fallback should use an optimized variant: ${src}`);
    assert(props.sizes === sizes, `responsive image should declare its layout size: ${src}`);
    assert(props.srcSet === metadata.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "), `srcset should describe every generated width: ${src}`);
  }

  let articleImageCount = 0;
  for (const locale of ["en", "zh"] as const) {
    const profile = profilesByLocale[locale];
    checkResponsiveSource(profile.portrait, imageSizes.portrait);
    for (const entry of profile.timeline) {
      if (entry.logoSrc) checkResponsiveSource(entry.logoSrc, imageSizes.timelineLogo);
    }
    const entries = listMemory(locale);
    const firstCover = getImageMetadata(entries[0].image);
    assert(firstCover?.variants?.every((variant) => variant.bytes <= 100_000), `${locale} first cover should never serve a WebP over 100 KB`);
    for (const entry of entries) {
      checkResponsiveSource(entry.image, imageSizes.noteCover);
      const detail = getMemoryDetail(locale, entry.slug);
      if (!detail) continue;
      if (detail.image) checkResponsiveSource(detail.image, imageSizes.noteHero);
      const blocks = parseNoteMarkdown(readFileSync(join("public", detail.contentPath), "utf8"), { assetBasePath: detail.assetBasePath });
      for (const block of blocks) {
        if (block.type !== "image") continue;
        const metadata = getImageMetadata(block.src);
        assert(metadata && metadata.width > 0 && metadata.height > 0, `resolved article image should have dimensions before loading: ${locale}/${entry.slug}/${block.src}`);
        assert(readFileSync(join("public", block.src)).equals(readFileSync(join("dist", block.src))), `article image should be copied unchanged into the build: ${block.src}`);
        articleImageCount++;
      }
    }
  }
  assert(articleImageCount > 0, "image checks should exercise actual article images");

  // Historical ../images/ links must use the note's asset base before metadata
  // lookup. Absolute URLs and URL suffixes must not break the geometry lookup.
  const fixture = parseNoteMarkdown("![Fixture](../../images/img_1.jpg?size=full#figure)", { assetBasePath: "/media/notes/henpri" });
  assert(fixture[0]?.type === "image", "image geometry fixture should parse");
  const dimensions = getImageMetadata(fixture[0].src);
  assert(dimensions?.width === 1280 && dimensions.height === 720, "resolved relative image should reserve its real 16:9 geometry");
  assert(getImageMetadata("/media/notes/henpri/%69mg_1.jpg") === dimensions, "encoded local image paths should resolve to the same metadata");
  for (const src of ["https://example.com/unknown.jpg", "/media/missing.jpg", "/media/%broken.jpg"]) {
    const props = getResponsiveImageProps(src, "100vw");
    assert(props.src === src && props.width === undefined && props.height === undefined && props.srcSet === undefined, `unknown assets should not receive invented dimensions or variants: ${src}`);
  }
  console.log(`Image checks passed: ${variantCount} variants and ${articleImageCount} article image references across both locales.`);
}

const target = process.argv[2] ?? "all";

if (target === "note" || target === "all") {
  checkNoteMarkdownParsing();
}

if (target === "memory" || target === "all") {
  checkMemoryContentIntegrity();
}

if (target === "text" || target === "all") {
  checkSiteTextShape();
}

if (target === "meta" || target === "all") {
  checkDocumentMetaShape();
}

if (target === "routes" || target === "all") {
  checkRouteManifest();
}

if (target === "images" || target === "all") {
  checkImageLoadingShape();
  checkResponsiveImages();
}

if (target === "crawl" || target === "all") {
  checkCrawlFiles();
}

assert(
  target === "note" ||
    target === "memory" ||
    target === "text" ||
    target === "meta" ||
    target === "routes" ||
    target === "images" ||
    target === "crawl" ||
    target === "all",
  `unknown check target: ${target}`,
);
