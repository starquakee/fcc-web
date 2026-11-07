import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Run from any directory. Originals are read-only inputs; only responsive/ and
// the generated metadata module are written. Commit both outputs together.
const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const mediaDir = join(publicDir, "media");
const outputDir = join(mediaDir, "responsive");
const manifestPath = join(root, "src/generated/imageMetadata.ts");
const checkOnly = process.argv.includes("--check");
assert(process.argv.slice(2).every((arg) => arg === "--check"), "Only --check is supported");

const coverWidths = [320, 480, 640, 800, 960];
const sources = {
  // Four neutral tones retain the paper's full-resolution glyph edges without
  // lossy WebP ringing. This setting is specific to this monochrome cover.
  "/media/memory-istratde-alphaevolve.png": { widths: coverWidths, palette: 4 },
  "/media/memory-freedom.jpg": { widths: coverWidths },
  "/media/notes/henpri/freedom.jpg": { widths: coverWidths },
  "/media/profile-photo.jpg": { widths: [300, 420, 600, 840, 1260] },
  "/media/logos/moonshot.webp": { widths: [72, 144, 216, 320, 536] },
  "/media/logos/sangfor.png": { widths: [72, 144, 216], lossless: true },
  "/media/logos/sustech.jpg": { widths: [72, 144, 216] },
};

async function listFiles(directory) {
  const result = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const path = join(directory, entry.name);
    if (path === outputDir) continue;
    if (entry.isDirectory()) result.push(...await listFiles(path));
    else if (entry.isFile() && /\.(?:jpe?g|png|webp)$/i.test(entry.name)) result.push(path);
  }
  return result;
}

async function emit(path, data) {
  if (checkOnly) {
    assert((await readFile(path)).equals(Buffer.from(data)), `Stale generated file: ${relative(root, path)}; run npm run images:generate`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data);
  }
}

const metadata = {};
const outputPaths = new Set();
for (const path of await listFiles(mediaDir)) {
  const src = `/${relative(publicDir, path).replaceAll("\\", "/")}`;
  const input = await readFile(path);
  const original = await sharp(input).metadata();
  const { width, height } = original.autoOrient;
  assert(width > 0 && height > 0, `Missing dimensions: ${src}`);
  const entry = { width, height };
  const settings = sources[src];
  if (settings) {
    entry.variants = [];
    // Cap and deduplicate widths so small originals are never enlarged.
    const widths = [...new Set(settings.widths.map((target) => Math.min(target, width)))].sort((a, b) => a - b);
    for (const target of widths) {
      let pipeline = sharp(input).autoOrient().resize({ width: target, withoutEnlargement: true });
      if (settings.palette) {
        pipeline = sharp(await pipeline.png({ palette: true, colours: settings.palette, dither: 0 }).toBuffer());
      }
      let { data, info } = await pipeline.webp({
        quality: settings.palette || settings.lossless ? 100 : 82,
        lossless: Boolean(settings.palette || settings.lossless),
        effort: 6,
      }).toBuffer({ resolveWithObject: true });
      // Reuse an already compressed WebP at its native size instead of
      // recompressing it (or turning a small lossy image into a larger file).
      if (original.format === "webp" && target === width && !original.orientation) {
        data = input;
        info = { ...info, width, height };
      }
      assert(data.length < input.length || data.equals(input), `Variant is larger than its original: ${src}`);
      assert(info.width <= width && info.height <= height, `Upscaled variant: ${src}`);
      assert(Math.abs(info.height - height * info.width / width) <= 1, `Changed aspect ratio: ${src}`);
      if (src === "/media/memory-istratde-alphaevolve.png") {
        assert(data.length <= 100_000, `First cover exceeds 100 KB at ${info.width}px`);
      }
      const variantSrc = `/media/responsive/${src.slice("/media/".length)}-${info.width}.webp`;
      const outputPath = join(publicDir, variantSrc);
      await emit(outputPath, data);
      outputPaths.add(resolve(outputPath));
      entry.variants.push({ src: variantSrc, width: info.width, height: info.height, bytes: data.length });
    }
    console.log(`${src}: ${entry.variants.map((variant) => `${variant.width}w/${variant.bytes}B`).join(", ")}`);
  }
  metadata[src] = entry;
}
for (const src of Object.keys(sources)) assert(metadata[src], `Missing configured image: ${src}`);

// Do not silently delete old assets; fail so a renamed/removed input is reviewed.
for (const path of await listFiles(outputDir)) {
  assert(outputPaths.has(resolve(path)), `Unexpected generated asset: ${relative(root, path)}`);
}
await emit(manifestPath,
  '// Generated by npm run images:generate. Do not edit by hand.\n' +
  'import type { ImageMetadata } from "../types/images";\n\n' +
  `export const imageMetadata: Readonly<Record<string, ImageMetadata>> = ${JSON.stringify(metadata, null, 2)};\n`,
);
console.log(`${checkOnly ? "Verified" : "Generated"} ${outputPaths.size} WebP variants and dimensions for ${Object.keys(metadata).length} originals.`);
