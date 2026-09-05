import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseNoteMarkdown } from "../src/lib/noteMarkdown";
import { getMemoryDetail, listMemory } from "../src/content/memoryCatalog";
import { profilesByLocale } from "../src/content/profile";
import { siteText } from "../src/content/siteText";
import { getRouteMeta, primaryRouteIds, routeManifest } from "../src/routeManifest";

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
  const indexSource = readFileSync("index.html", "utf8");

  assert(hookSource.includes("DocumentMetaOptions"), "useDocumentMeta should expose an object options interface");
  assert(hookSource.includes('meta[property="og:image"]'), "useDocumentMeta should update og:image");
  assert(hookSource.includes('meta[name="twitter:card"]'), "useDocumentMeta should update twitter:card");
  assert(hookSource.includes('link[rel="canonical"]'), "useDocumentMeta should update canonical link");
  assert(
    indexSource.includes("https://starquake.top/media/profile-photo.jpg"),
    "index.html should use an absolute default og:image",
  );
}

function checkImageLoadingShape() {
  const memoryPageSource = readFileSync("src/pages/MemoryPage.tsx", "utf8");
  const memoryDetailSource = readFileSync("src/pages/MemoryDetailPage.tsx", "utf8");

  assert(memoryPageSource.includes('loading={index === 0 ? "eager" : "lazy"}'), "memory list images should lazy-load after the first item");
  assert(memoryPageSource.includes('decoding="async"'), "memory list images should decode asynchronously");
  assert(memoryDetailSource.includes('loading="lazy"'), "note article images should lazy-load");
  assert(memoryDetailSource.includes('decoding="async"'), "note detail images should decode asynchronously");
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
}

assert(
  target === "note" ||
    target === "memory" ||
    target === "text" ||
    target === "meta" ||
    target === "routes" ||
    target === "images" ||
    target === "all",
  `unknown check target: ${target}`,
);
