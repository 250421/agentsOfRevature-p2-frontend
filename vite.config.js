// vite.config.ts
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    // 1) File‑based routing
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
      // these defaults match most projects—you can omit them entirely if you like:
      // routesDirectory: "./src/routes",
      // generatedRouteTree: "./src/routeTree.gen.ts",
    }),

    // 2) React + Tailwind
    viteReact(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
});
