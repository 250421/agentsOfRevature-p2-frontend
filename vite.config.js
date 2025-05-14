import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  // Load your `.env` variables (e.g. VITE_SUPERHERO_TOKEN)
  const env = loadEnv(mode, process.cwd(), '')
  const token = env.VITE_SUPERHERO_TOKEN

  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
    server: {
      proxy: {
        '/external/api': {
          target: `https://superheroapi.com/api/${token}`,
          changeOrigin: true,
          // Strip `/external/api` so that `/external/api/1` → `https://…/api/<token>/1`
          rewrite: (path) => path.replace(/^\/external\/api/, ''),
        },
      },
    },
  }
})
