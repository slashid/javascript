import { defineConfig } from "vitest/config";
import { config } from "./vite.shared";

export default defineConfig({
  ...config,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./scripts/test-setup.js"],
    deps: {
      optimizer: {
        web: {
          include: ["vitest-canvas-mock"],
        },
      },
    },
  },
});
