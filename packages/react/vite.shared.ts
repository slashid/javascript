import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// config entries to be shared between vite.config.ts and vitest.config.ts
export const config = {
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "@slashid/react-primitives": resolve(
        __dirname,
        "../react-primitives/src/main.ts"
      ),
    },
  },
};
