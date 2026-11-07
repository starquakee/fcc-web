import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createCrawlFiles } from "./scripts/site-crawl";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [
      react(),
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
