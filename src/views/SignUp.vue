<template>
  <h1 class="text-center text-lg">Signin a account</h1>
  <p><input type="text" placeholder="Firt Name" v-model="firstName" required /></p>
  <p><input type="text" placeholder="Last Name" v-model="lastName" /></p>
  <p><input type="email" placeholder="E-mail" v-model="email" required /></p>
  <p><input type="password" placeholder="Password" v-model="password" required /></p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="signInWithGoogle">Sign In with Google.</button></p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import router from '@/router'
const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')

const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user

      // Update user profile with first and last name
      updateProfile(user, {
        displayName: `${firstName.value} ${lastName.value}`
      })
        .then(() => {
          alert('Successful Sign In!')
          router.push('/')
        })
        .catch((error) => {
          alert(error.message)
        })
    })
    .catch((error) => {
      alert(error.message)
    })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then(() => {
      alert('Successful Sign In!')
      router.push('/')
    })
    .catch((error) => {
      alert(error.message)
    })
}
</script>
