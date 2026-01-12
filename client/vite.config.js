import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'VetChatbot',
      fileName: 'chatbot-sdk',
      formats: ['iife'], // Immediately Invoked Function Expression for script tag usage
    },
    rollupOptions: {
      output: {
        // Ensure consistent naming
        extend: true,
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"' // React needs this in production build
  }
})
