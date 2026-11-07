import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createCrawlFiles } from "./scripts/site-crawl";
import { getRouteMeta, routeManifest } from "./src/routeManifest";
import { siteConfig } from "./src/siteConfig";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [
      react(),
      {
        name: "site-document-meta",
        transformIndexHtml() {
          // One default SPA document; route/locale-specific metadata is updated by React.
          const meta = getRouteMeta("home", "en");
          const canonicalUrl = new URL(routeManifest.home.path, siteConfig.origin).href;
          const imageUrl = new URL(meta.image ?? siteConfig.defaultImage, siteConfig.origin).href;

          return [
            { tag: "title", children: meta.title },
            { tag: "link", attrs: { rel: "canonical", href: canonicalUrl } },
            ...Object.entries({
              description: meta.description,
              "twitter:card": "summary_large_image",
              "twitter:title": meta.title,
              "twitter:description": meta.description,
              "twitter:image": imageUrl,
            }).map(([name, content]) => ({ tag: "meta", attrs: { name, content } })),
            ...Object.entries({
              "og:title": meta.title,
              "og:description": meta.description,
              "og:type": meta.type ?? "website",
              "og:url": canonicalUrl,
              "og:image": imageUrl,
            }).map(([property, content]) => ({ tag: "meta", attrs: { property, content } })),
          ].map((tag) => ({ ...tag, injectTo: "head" as const }));
        },
      },
      {
        name: "site-crawl-files",
        generateBundle() {
          for (const [fileName, source] of Object.entries(createCrawlFiles())) {
            this.emitFile({ type: "asset", fileName, source });
          }
        },
      },
    ],
  };
});
