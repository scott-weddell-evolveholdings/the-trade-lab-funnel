import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    createHtmlPlugin({
      minify: false,
      pages: [
        {
          filename: 'index.html',
          template: 'index.html',
          injectOptions: {
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
            ejsOptions: {
              filename: path.resolve(__dirname, 'welcome.html')
            }
          }
        }
      ]
    })
  ]
})
