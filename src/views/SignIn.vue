<template>
  <h1 class="text-center text-lg">Create a account</h1>
  <p><input type="email" placeholder="E-mail" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="signInWithGoogle">Sign In with Google.</button></p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import router from '@/router'
const email = ref('')
const password = ref('')
const errMsg = ref('')

const auth = getAuth()

const register = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      alert('Succesfull Registered!')

      console.log(auth.currentUser)
      router.push('/')
    })
    .catch((error) => {
      console.log('error', error.code)
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Email is invalid.'
          break

        case 'auth/user-not-found':
          errMsg.value = 'No Account with this Email'
          break

        case 'auth/wrong-password':
          errMsg.value = 'Password is invalid.'
          break
      }

      alert(error.message)
    })
}

const signInWithGoogle = () => {}
</script>
