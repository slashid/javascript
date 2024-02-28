import { resolve, join } from "node:path";
import { defineConfig } from "vite";
import { config } from "./vite.shared";
import rollupPluginPolyfill from "rollup-plugin-polyfill";

import * as packageJson from "./package.json";

const polyfillsJs = resolve(join(__dirname, "src/polyfills.js"));

export default defineConfig({
  ...config,
  plugins: [rollupPluginPolyfill([polyfillsJs])],
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
