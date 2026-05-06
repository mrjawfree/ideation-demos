import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
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
