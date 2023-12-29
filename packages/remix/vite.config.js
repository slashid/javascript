import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs"

import * as packageJson from "./package.json";

const css = JSON.stringify(readFileSync("./node_modules/@slashid/react/dist/style.css", "utf-8"))

export default defineConfig({
  plugins: [react()],
  define: {
    __REACT_FORM_STYLES__: css
  },
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
