import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
// import { resolve } from "path";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      entryRoot: "src",
      outDir: "dist/types",
    }),
  ],
  build: {
    lib: {
      // entry: resolve(__dirname, "src/index.ts"),
      entry: "src/index.ts",
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
  // resolve: {
  //   alias: {
  //     src: resolve(__dirname, "src"),
  //     api: resolve(__dirname, "src/api"),
  //     types: resolve(__dirname, "src/types"),
  //   },
  // },
});
