import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.VITE_SUPERHERO_TOKEN;

  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
    ],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      globals: true,
      css: false,
      watch: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './coverage', // Where the reports will be saved
        exclude: [
          'node_modules/',
          'src/main.tsx',
          'src/components/ui/**',
          'src/lib/utils.ts',
          '**/*.d.ts',
          '**/routeTree.gen.ts',
          '**/models/**'
        ],
        include: [
          'src/**/*.{ts,tsx}',
        ],
        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // superhero API
        "/external/api": {
          target: `https://superheroapi.com/api/${token}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/external\/api/, ""),
        },
        // Spring Boot auth endpoints
        "/auth": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  };
});
