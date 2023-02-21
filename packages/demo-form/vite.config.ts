import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "DemoForm",
      formats: ["es"],
      fileName: (format) => `demo-form.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@slashid/slashid", "@slashid/react"],
    },
    sourcemap: true,
  },
});
