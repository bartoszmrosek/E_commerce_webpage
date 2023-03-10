import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  test: {
    globals: true,
    environment: "jsdom",
    mockReset: true,
    css: {
      modules: {
        classNameStrategy: "non-scoped"
      }
    },
    setupFiles: "./testUtils/setup.ts",
  },
  base: "/"
});
