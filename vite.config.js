import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Loaded here (not via import.meta.env) because these values need to land
  // inside the EJS-rendered <head>, before any JS module runs.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const analyticsData = { GTM_ID: env.VITE_GTM_ID || '' }

  return {
    base: './',
    plugins: [
      createHtmlPlugin({
        minify: false,
        pages: [
          {
            filename: 'index.html',
            template: 'index.html',
            injectOptions: {
              data: analyticsData,
              ejsOptions: {
                filename: path.resolve(__dirname, 'index.html')
              }
            }
          },
          {
            filename: 'demo.html',
            template: 'demo.html',
            injectOptions: {
              ejsOptions: {
                filename: path.resolve(__dirname, 'demo.html')
              }
            }
          },
          {
            filename: 'welcome.html',
            template: 'welcome.html',
            injectOptions: {
              data: analyticsData,
              ejsOptions: {
                filename: path.resolve(__dirname, 'welcome.html')
              }
            }
          }
        ]
      })
    ]
  }
})
