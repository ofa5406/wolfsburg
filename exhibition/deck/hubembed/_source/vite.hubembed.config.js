import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Standalone build of the interactive hub-typology diagram (plan + axonometric
// + element legend) from the Urban Design tool, embedded (offline) into the
// <stadt.hub> deck at ../exhibition/deck/hubembed.
//   root = embed-hub/  → flat output (index.html at hubembed root)
//   base './'          → assets resolve relative to the iframe src
export default defineConfig({
  root: resolve(__dirname, 'embed-hub'),
  base: './',
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, '../exhibition/deck/hubembed'),
    emptyOutDir: true,
  },
})
