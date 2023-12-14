import { useProductStore } from './stores/productStore'
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
  apiKey: 'AIzaSyDEOUmxbm5DmM6AfSKK6HCj9ZMnkUzvVdA',
  authDomain: 'e-commerce-7881c.firebaseapp.com',
  projectId: 'e-commerce-7881c',
  storageBucket: 'e-commerce-7881c.appspot.com',
  messagingSenderId: '114784541205',
  appId: '1:114784541205:web:e46f9e1c5926696960cc1c',
  measurementId: 'G-51SDYVZM48'
}

// Initialize Firebase
initializeApp(firebaseConfig)
const pinia = createPinia()
import router from './router'
const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
