import { build } from "esbuild";

const result = await build({
  entryPoints: ["./scripts/check-site-content.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  packages: "external",
  absWorkingDir: process.cwd(),
  write: false,
  logLevel: "silent",
});

const output = result.outputFiles[0]?.text;

if (!output) {
  throw new Error("Content check bundle was empty");
}

await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
