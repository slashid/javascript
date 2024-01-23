import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [vanillaExtractPlugin()],
    resolve: {
      alias: {
        "@slashid/react-primitives": path.resolve(
          __dirname,
          "../../packages/react-primitives/src/main.ts"
        ),
      },
    },
  },
});
