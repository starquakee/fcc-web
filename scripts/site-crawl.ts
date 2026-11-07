import { memoryDetailsByLocale } from "../src/content/memoryCatalog";
import { routeManifest } from "../src/routeManifest";
import { siteConfig } from "../src/siteConfig";

export function getCrawlPaths() {
  const staticPaths = Object.values(routeManifest)
    .map((route) => route.path)
    .filter((path) => !path.includes(":") && !path.includes("*"));
  const notePaths = Object.values(memoryDetailsByLocale).flatMap((details) =>
    details.map((detail) => routeManifest.memoryDetail.path.replace(":slug", encodeURIComponent(detail.slug))),
  );

  return [...new Set([...staticPaths, ...notePaths])];
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
    };
    return entities[character];
  });
}

export function createCrawlFiles(paths = getCrawlPaths()) {
  const urls = [...new Set(paths)].map((path) => {
    const url = new URL(path, siteConfig.origin);
    if (!path.startsWith("/") || url.origin !== siteConfig.origin || /[:*]/.test(path)) {
      throw new Error(`Invalid crawl path: ${path}`);
    }
    return `  <url><loc>${escapeXml(url.href)}</loc></url>`;
  });

  return {
    "robots.txt": `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.origin}/sitemap.xml\n`,
    "sitemap.xml": [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      "</urlset>\n",
    ].join("\n"),
  };
}
