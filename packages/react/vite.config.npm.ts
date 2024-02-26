import { resolve } from "node:path";
import { defineConfig } from "vite";
import { config } from "./vite.shared";

import * as packageJson from "./package.json";

export default defineConfig({
  ...config,
  build: {
    lib: {
      entry: resolve(__dirname, "src/entry.npm.ts"),
      formats: ["es"],
      fileName: `main`
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
    sourcemap: true,
  },
});
