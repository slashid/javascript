import { defineConfig } from "vitest/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  // @ts-ignore
  plugins: [vanillaExtractPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./scripts/test-setup.js",
  },
});
