#!/usr/bin/env node
/**
 * Post-build bundler: inlines all local CSS and JS into a single HTML file.
 * Images and media are left as-is (not inlined).
 *
 * Usage: node scripts/bundle.js [input] [output]
 *   Defaults: dist/index.html → dist/index.single.html
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname, dirname as pathDirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')

// Default input is the single-entry build output (dist/.single/index.html).
// That build has one JS chunk with no inter-chunk imports, so the inlined
// <script type="module"> is fully self-contained.
const singleBuildDir = resolve(distDir, '.single')
const inputFile  = process.argv[2] ? resolve(process.argv[2]) : resolve(singleBuildDir, 'index.html')
const outputFile = process.argv[3] ? resolve(process.argv[3]) : resolve(distDir, 'index.single.html')

if (!existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`)
  console.error('Run `npm run build` first.')
  process.exit(1)
}

let html = readFileSync(inputFile, 'utf8')

// Resolve a src/href like "/assets/foo.js" to an absolute path on disk.
// Assets live next to the input HTML file, not in distDir root.
const inputDir = pathDirname(inputFile)
function resolvePath(ref) {
  const rel = ref.replace(/^\//, '')
  // Try relative to the input HTML directory first (handles dist/.single/assets/…)
  const adjacent = resolve(inputDir, rel)
  if (existsSync(adjacent)) return adjacent
  // Fall back to distDir for backwards compatibility
  return resolve(distDir, rel)
}

function readAsset(ref) {
  const abs = resolvePath(ref)
  if (!existsSync(abs)) {
    console.warn(`  [skip] asset not found on disk: ${abs}`)
    return null
  }
  return readFileSync(abs, 'utf8')
}

// ── 1. Inline <link rel="stylesheet" href="/assets/..."> ──────────────────────
html = html.replace(
  /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi,
  (tag, href) => {
    // Keep external stylesheets (Google Fonts, CDN, etc.) untouched
    if (/^https?:\/\//i.test(href)) return tag

    const css = readAsset(href)
    if (css === null) return tag

    console.log(`  [css] inlined ${href}`)
    return `<style>${css}</style>`
  }
)

// ── 2. Inline <script type="module" src="/assets/..."> ───────────────────────
html = html.replace(
  /<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi,
  (tag, before, src, after) => {
    if (/^https?:\/\//i.test(src)) return tag

    const js = readAsset(src)
    if (js === null) return tag

    // Strip src and crossorigin (no longer needed after inlining).
    // Keep type="module" — the inlined script is a self-contained ES module
    // (no inter-chunk imports) so the browser handles it correctly as-is.
    const attrsToStrip = /\s*(src|crossorigin)=["'][^"']*["']/gi
    const cleanAttrs = (before + after).replace(attrsToStrip, '').trim()

    console.log(`  [js]  inlined ${src}`)
    return `<script${cleanAttrs ? ' ' + cleanAttrs : ''}>${js}</script>`
  }
)

// ── 3. Remove <link rel="modulepreload"> — no longer needed after inlining ───
html = html.replace(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>\n?/gi, (tag) => {
  console.log(`  [rm]  removed modulepreload tag`)
  return ''
})

writeFileSync(outputFile, html, 'utf8')

const kb = (readFileSync(outputFile).length / 1024).toFixed(1)
console.log(`\nDone! Single-file build → ${outputFile} (${kb} KB)`)
