import { deepStrictEqual, throws } from "node:assert";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { parseNoteMarkdown } from "../src/lib/noteMarkdown";
import { getImageMetadata, getResponsiveImageProps, imageSizes } from "../src/lib/responsiveImages";
import { imageMetadata } from "../src/generated/imageMetadata";
import { getMemoryDetail, listMemory } from "../src/content/memoryCatalog";
import { profilesByLocale } from "../src/content/profile";
import { siteText } from "../src/content/siteText";
import { projectsByLocale } from "../src/content/projects";
import { publicationsByLocale } from "../src/content/publications";
import { socialLinksByLocale } from "../src/content/links";
import { getRouteMeta, primaryRouteIds, routeManifest } from "../src/routeManifest";
import { siteConfig } from "../src/siteConfig";
import { createCrawlFiles, getCrawlPaths } from "./site-crawl";
import { assertDocumentUrls, assertLocalAsset, assertLocaleKeys } from "./content-validation";

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
  deepStrictEqual(listMemory("en").map((entry) => entry.slug), listMemory("zh").map((entry) => entry.slug), "note slugs and order must match across locales");
  for (const locale of ["en", "zh"] as const) {
    const entries = listMemory(locale);
    const entrySlugs = new Set(entries.map((entry) => entry.slug));

    assert(entrySlugs.size === entries.length, `${locale} memory entries should not contain duplicate slugs`);

    for (const entry of entries) {
      const detail = getMemoryDetail(locale, entry.slug);
      assert(Boolean(detail) === Boolean(getMemoryDetail(locale === "en" ? "zh" : "en", entry.slug)), `${entry.slug} should have detail parity`);
      assert(entry.title.trim() && entry.summary.trim(), `${locale}/${entry.slug} needs title and summary`);
      assertLocalAsset(entry.image, "public", "dist");

      if (!detail) {
        continue;
      }

      assert(detail.contentPath.startsWith("/notes/"), `${locale} detail ${detail.slug} should load from /notes`);
      const markdown = assertLocalAsset(detail.contentPath, "public", "dist").toString("utf8");
      const blocks = parseNoteMarkdown(markdown, { assetBasePath: detail.assetBasePath });
      assert(blocks.some((block) => block.type === "paragraph"), `${locale}/${detail.slug} needs a nonempty article body`);
      for (const block of blocks) {
        if (block.type === "image") assertLocalAsset(block.src, "public", "dist");
      }
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

function checkLocaleContent() {
  assertLocaleKeys(siteText.en, siteText.zh);
  for (const [label, catalog] of Object.entries({ publications: publicationsByLocale, projects: projectsByLocale })) {
    const slugs = catalog.en.map((entry) => entry.slug);
    assert(new Set(slugs).size === slugs.length, `${label} slugs must be unique`);
    deepStrictEqual(slugs, catalog.zh.map((entry) => entry.slug), `${label} locale slugs and order must match`);
  }
  deepStrictEqual(socialLinksByLocale.en.map((link) => link.href), socialLinksByLocale.zh.map((link) => link.href), "social destinations should match across locales");
  for (const locale of ["en", "zh"] as const) {
    const profile = profilesByLocale[locale];
    assert(profile.heroTitle.trim() && profile.seoDescription.trim(), `${locale} profile needs heading and metadata`);
    assertLocalAsset(profile.portrait, "public", "dist");
    for (const entry of profile.timeline) {
      if (entry.logoSrc) assertLocalAsset(entry.logoSrc, "public", "dist");
    }
    for (const publication of publicationsByLocale[locale]) {
      assert(publication.title.trim() && publication.summary.trim(), `${locale}/${publication.slug} needs title and summary`);
      const pdf = assertLocalAsset(publication.pdfUrl, "public", "dist");
      assert(pdf.toString("ascii", 0, 5) === "%PDF-", `publication should link to PDF bytes: ${publication.slug}`);
    }
    for (const project of projectsByLocale[locale]) {
      assert(project.title.trim() && project.summary.trim(), `${locale}/${project.slug} needs title and summary`);
      // Empty project links are an accepted, deferred content decision.
      for (const link of project.links) {
        if (link.href.startsWith("/")) assertLocalAsset(link.href, "public", "dist");
      }
    }
  }
  const resume = assertLocalAsset("/docs/resume.pdf", "public", "dist");
  assert(resume.toString("ascii", 0, 5) === "%PDF-", "CV resource must contain a PDF");
}

function checkDocumentMetadata() {
  const builtHtml = readFileSync("dist/index.html", "utf8");

  function readHeadUrl(tag: "meta" | "link", key: string, value: string, attribute: string) {
    const tags = [...builtHtml.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))];
    const matches = tags.filter(([markup]) => markup.includes(`${key}="${value}"`));
    assert(matches.length === 1, `built HTML should have exactly one ${value} tag`);
    const content = matches[0][0].match(new RegExp(`${attribute}="([^"]*)"`))?.[1];
    assert(content, `built HTML ${value} needs ${attribute}`);
    return content;
  }

  const homeUrl = new URL(routeManifest.home.path, siteConfig.origin).href;
  const homeMeta = getRouteMeta("home", "en");
  const defaultImageUrl = new URL(homeMeta.image ?? siteConfig.defaultImage, siteConfig.origin).href;
  assertDocumentUrls({
    canonical: readHeadUrl("link", "rel", "canonical", "href"),
    openGraphUrl: readHeadUrl("meta", "property", "og:url", "content"),
    openGraphImage: readHeadUrl("meta", "property", "og:image", "content"),
    twitterImage: readHeadUrl("meta", "name", "twitter:image", "content"),
  }, siteConfig.origin);
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
    const original = assertLocalAsset(assetPath, "public", "dist");
    const isJpeg = original.subarray(0, 3).toString("hex") === "ffd8ff";
    const isPng = original.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    const isWebp = original.toString("ascii", 0, 4) === "RIFF" && original.toString("ascii", 8, 12) === "WEBP";
    assert(isJpeg || isPng || isWebp, `share asset should contain image bytes: ${imagePath}`);
  }

  const bundleFiles = readdirSync("dist/assets").filter((file) => file.endsWith(".js"));
  assert(bundleFiles.length > 0, "metadata checks require a built application bundle");
  for (const file of ["dist/index.html", ...bundleFiles.map((file) => join("dist/assets", file))]) {
    assert(!readFileSync(file, "utf8").includes("starquake.top"), `${file} should not contain the obsolete metadata origin`);
  }
  console.log(`Metadata checks passed: initial HTML, both locales, ${imagePaths.size} share images, and built origin references.`);
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

function checkValidationFixtures() {
  // Positive controls plus deliberate failures exercise the same validators used
  // above without changing any tracked content or generated build output.
  const root = mkdtempSync(join(tmpdir(), "fcc-content-fixtures-"));
  try {
    writeFileSync(join(root, "valid.txt"), "fixture");
    assertLocalAsset("/valid.txt", root, root);
    throws(() => assertLocalAsset("/missing.txt", root), /Missing local asset/);
    throws(() => assertLocalAsset("/valid.txt", root, join(root, "missing-build")), /Missing local asset/);
  } finally {
    assert(dirname(root) === resolve(tmpdir()) && basename(root).startsWith("fcc-content-fixtures-"), "fixture cleanup must stay in its temporary directory");
    rmSync(root, { recursive: true, force: true });
  }
  const valid = {
    canonical: `${siteConfig.origin}/memory`,
    openGraphUrl: `${siteConfig.origin}/memory`,
    openGraphImage: `${siteConfig.origin}${siteConfig.defaultImage}`,
    twitterImage: `${siteConfig.origin}${siteConfig.defaultImage}`,
  };
  assertDocumentUrls(valid, siteConfig.origin);
  for (const key of Object.keys(valid)) {
    throws(() => assertDocumentUrls({ ...valid, [key]: "https://wrong-origin.invalid/fixture" }, siteConfig.origin), /approved origin/);
  }
  throws(() => assertDocumentUrls({ ...valid, canonical: `${valid.canonical}?fixture=1` }, siteConfig.origin), /query and hash/);
  throws(() => assertLocaleKeys({ title: "Title" }, {}), /locale keys/);
  throws(() => assertLocaleKeys({ title: "Title" }, { title: " " }), /nonempty copy/);
  console.log("Validation fixtures passed: valid input accepted; missing source/build assets, wrong origins, canonical queries and locale gaps rejected.");
}

if (target === "note" || target === "all") {
  checkNoteMarkdownParsing();
}

if (target === "memory" || target === "all") {
  checkMemoryContentIntegrity();
}

if (target === "text" || target === "all") {
  checkLocaleContent();
}

if (target === "meta" || target === "all") {
  checkDocumentMetadata();
}

if (target === "routes" || target === "all") {
  checkRouteManifest();
}

if (target === "images" || target === "all") {
  checkResponsiveImages();
}

if (target === "crawl" || target === "all") {
  checkCrawlFiles();
}

if (target === "fixtures" || target === "all") {
  checkValidationFixtures();
}

assert(
  target === "note" ||
    target === "memory" ||
    target === "text" ||
    target === "meta" ||
    target === "routes" ||
    target === "images" ||
    target === "crawl" ||
    target === "fixtures" ||
    target === "all",
  `unknown check target: ${target}`,
);
