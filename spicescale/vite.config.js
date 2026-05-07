import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'meal-planner': resolve(__dirname, 'meal-planner.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-service-worker',
      closeBundle() {
        copyFileSync('sw.js', 'dist/sw.js')
      }
    }
  ]
})
