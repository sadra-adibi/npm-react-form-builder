import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [react()],
  build: {
    // Library mode — tells Vite this is an npm package, not an app
    lib: {
      // The entry point that exports all public components
      entry: path.resolve(__dirname, "src/index.js"),
      // The global variable name used in UMD/IIFE builds
      name: "NpmReactFormBuilder",
      // Output file name (without extension — Vite appends .js / .umd.cjs automatically)
      fileName: (format) => `npm-react-form-builder.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Externalize react and react-dom so they are NOT bundled into our library.
      // Consumers of this package must have their own react installation.
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        // Map the externalized modules to global variables for UMD builds
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Inject CSS into a separate file (style.css) so consumers can import it
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "style.css";
          return assetInfo.name;
        },
      },
    },
    // Generate sourcemaps for easier debugging when consumers use this library
    sourcemap: true,
    // Don't empty the dist folder before build (allows coexistence with other assets)
    emptyOutDir: true,
  },
});
