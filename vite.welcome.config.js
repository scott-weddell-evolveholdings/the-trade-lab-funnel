/**
 * Vite config for the single-file GHL build of welcome.html (npm run build:single:welcome).
 *
 * Mirrors vite.single.config.js but for the post-opt-in welcome/quiz/offer flow.
 * Single entry → Rollup bundles all imports (after-site.js, animejs, assets) into
 * one JS file with no inter-chunk import statements → bundle.js inlines it cleanly.
 */

import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: false,
      pages: [
        {
          filename: 'welcome.html',
          template: 'welcome.html',
          injectOptions: {
            ejsOptions: {
              filename: path.resolve(__dirname, 'welcome.html'),
            },
          },
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist/.single-welcome',
    emptyOutDir: true,
  },
})
