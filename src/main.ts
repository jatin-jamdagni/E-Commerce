import './main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import useUserCrediential from './stores/authStoreCrediential'
// import { useUserStore } from './stores/authStore'
// import { getAnalytics } from "firebase/analytics";

import App from './App.vue'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
initializeApp(firebaseConfig)
const pinia = createPinia()
import router from './router'
const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
