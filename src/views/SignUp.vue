<template>
  <h1 class="text-center text-lg">Signin a account</h1>
  <p><input type="email" placeholder="E-mail" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="signUpWithGoogle">Sign In with Google.</button></p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import router from '@/router'
const email = ref('')
const password = ref('')

const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      alert('Succesfull SignIn!')

      console.log(auth.currentUser)
      router.push('/')
    })
    .catch((error) => {
      console.log('error', error.code)
      alert(error.message)
    })
}

const signUpWithGoogle = () => {}
</script>
