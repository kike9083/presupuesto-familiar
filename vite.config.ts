import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // Essential for GitHub Pages relative paths
    define: {
      // Polyfill process.env.API_KEY specifically. 
      // Avoid overwriting the entire process.env object to preserve NODE_ENV and other internals.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    }
  }
})