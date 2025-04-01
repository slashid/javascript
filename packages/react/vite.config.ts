import { resolve } from "node:path";
import { defineConfig } from "vite";
import { config } from "./vite.shared";

export default defineConfig({
  ...config,
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: `main`,
    },
    rollupOptions: {
      // these must appear exactly as imported => having react here won't prevent react/jsx-runtime being bundled, so it must be explicit
      external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
    },
    sourcemap: true,
  },
});
