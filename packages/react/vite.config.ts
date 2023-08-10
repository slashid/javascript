import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { viteStaticCopy } from 'vite-plugin-static-copy'

import * as packageJson from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: 'README.md',
          dest: ''
        },
        {
          src: 'package.json',
          dest: ''
        }
      ]
    })
  ],
  build: {
    lib: {
      entry: "",
      formats: ["es"],
      fileName: `[name]`,
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.ts"),
        'middleware/index': resolve(__dirname, "src/middleware/index.ts")
      },
      external: [...Object.keys(packageJson.peerDependencies)],
    },
    sourcemap: true,
  },
});
