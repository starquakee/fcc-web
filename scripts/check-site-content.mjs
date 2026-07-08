import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outfile = "/private/tmp/fcc-web-checks/check-site-content.mjs";

await mkdir(dirname(outfile), { recursive: true });

await build({
  entryPoints: ["scripts/check-site-content.ts"],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  packages: "external",
  logLevel: "silent",
});

await import(`${pathToFileURL(resolve(outfile)).href}?t=${Date.now()}`);
