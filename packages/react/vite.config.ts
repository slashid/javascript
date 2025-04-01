import { resolve } from "node:path";
import { defineConfig } from "vite";
import { config } from "./vite.shared";

import * as packageJson from "./package.json";

export default defineConfig({
  ...config,
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: `main`,
    },
    rollupOptions: {
      external: [
        // include all the keys from peerDependencies by default
        ...Object.keys(packageJson.peerDependencies),
        // these must be specified explicitly as they are not matched by react and react-dom from peer deps
        "react/jsx-runtime",
        "react-dom/client",
      ],
    },
    sourcemap: true,
  },
});
