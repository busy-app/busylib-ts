import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "busylib",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: false,
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      api: resolve(__dirname, "src/api"),
    },
  },
});
