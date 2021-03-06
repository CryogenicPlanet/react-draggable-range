// vite.config.ts
// import tsconfigPaths from 'vite-tsconfig-paths' // can remove if you don't use ts config paths
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh()
    // tsconfigPaths()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'react-draggable-range',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'react'
        },
        exports: 'named'
      }
    }
  }
})
