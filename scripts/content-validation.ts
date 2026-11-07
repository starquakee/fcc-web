import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

// These validators consume values and real files, never component source text.
export function assertLocalAsset(path: string, sourceRoot = "public", buildRoot?: string) {
  assert(path.startsWith("/") && !path.startsWith("//"), `Expected a local asset path: ${path}`);
  const pathname = decodeURIComponent(path.split(/[?#]/)[0]);
  const assetPath = (root: string) => {
    const absolute = resolve(root, `.${pathname}`);
    const withinRoot = relative(resolve(root), absolute);
    assert(withinRoot && !withinRoot.startsWith("..") && !isAbsolute(withinRoot), `Asset escapes root: ${path}`);
    assert(statSync(absolute, { throwIfNoEntry: false })?.isFile(), `Missing local asset: ${path} in ${root}`);
    return absolute;
  };
  const bytes = readFileSync(assetPath(sourceRoot));
  assert(bytes.length > 0, `Empty local asset: ${path}`);
  if (buildRoot) {
    assert(bytes.equals(readFileSync(assetPath(buildRoot))), `Build asset differs from source: ${path}`);
  }
  return bytes;
}

export type DocumentUrls = {
  canonical: string;
  openGraphUrl: string;
  openGraphImage: string;
  twitterImage: string;
};

export function assertDocumentUrls(urls: DocumentUrls, origin: string) {
  for (const [label, value] of Object.entries(urls)) {
    const url = new URL(value);
    assert(url.origin === origin && !url.username && !url.password, `${label} must use approved origin: ${value}`);
  }
  const canonical = new URL(urls.canonical);
  assert(!canonical.search && !canonical.hash, "Canonical URL must exclude query and hash");
  assert.equal(urls.openGraphUrl, urls.canonical, "Open Graph URL must match canonical");
  assert.equal(urls.twitterImage, urls.openGraphImage, "Share images must match");
}

export function assertLocaleKeys(en: unknown, zh: unknown, path = "siteText") {
  if (typeof en === "string") {
    assert(en.trim() && typeof zh === "string" && zh.trim(), `${path} needs nonempty copy in both locales`);
    return;
  }
  assert(en && zh && typeof en === "object" && typeof zh === "object", `${path} needs both locales`);
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort(), `${path} locale keys must match`);
  for (const key of Object.keys(en)) {
    assertLocaleKeys((en as Record<string, unknown>)[key], (zh as Record<string, unknown>)[key], `${path}.${key}`);
  }
}
