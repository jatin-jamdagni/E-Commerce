import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }

  // define: {
  //   // Access environment variables in your code
  //   'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
  //   'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(
  //     process.env.VITE_FIREBASE_AUTH_DOMAIN
  //   ),
  //   'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(
  //     process.env.VITE_FIREBASE_PROJECT_ID
  //   ),
  //   'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
  //     process.env.VITE_FIREBASE_STORAGE_BUCKET
  //   ),
  //   'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
  //     process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  //   ),
  //   'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_FIREBASE_APP_ID),
  //   'import.meta.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(
  //     process.env.VITE_FIREBASE_MEASUREMENT_ID
  //   )
  // }
})
