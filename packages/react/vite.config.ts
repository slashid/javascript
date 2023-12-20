import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import * as packageJson from "./package.json";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "@slashid/react-primitives": resolve(
        __dirname,
        "../react-primitives/src/main.ts"
      ),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: `main`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
    sourcemap: true,
  },
});
