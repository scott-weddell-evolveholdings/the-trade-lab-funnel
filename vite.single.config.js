/**
 * Vite config for the single-file GHL build (npm run build:single).
 *
 * Key difference from vite.config.js:
 *   - Only index.html is the entry point.
 *   - Single entry → Rollup bundles every static import (animejs, after-site.js,
 *     icon.png, …) into ONE output JS file with zero inter-chunk import statements.
 *   - bundle.js can then inline that one script as <script type="module"> and it
 *     is self-contained — no dangling imports, no cross-origin chunk requests.
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
          filename: 'index.html',
          template: 'index.html',
          injectOptions: {
            ejsOptions: {
              filename: path.resolve(__dirname, 'index.html'),
            },
          },
        },
      ],
    }),
  ],
  build: {
    // Separate output dir so the regular dist/ (with demo.html, welcome.html,
    // and hashed assets) stays intact alongside the single-file output.
    outDir: 'dist/.single',
    emptyOutDir: true,
  },
})
