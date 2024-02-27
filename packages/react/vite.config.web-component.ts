import { resolve } from "node:path";
import { defineConfig } from "vite";
import { config } from "./vite.shared";

export default defineConfig({
  ...config,
  define: {
    'process.env.NODE_ENV': `"PRODUCTION"`
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/entry.web-component.tsx"),
      formats: ["es"],
      fileName: `main`
    },
    sourcemap: true
  },
});
