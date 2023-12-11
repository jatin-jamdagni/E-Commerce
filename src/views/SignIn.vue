<template>
  <main class="flex flex-col justify-center items-center h-[80vh] space-y-10">
    <form @submit.prevent="register" class="flex flex-col justify-center items-center space-y-10">
      <h1 class="text-center text-[32px] font-semibold">SignIn To Account</h1>
      <p v-if="errMsg">{{ errMsg }}</p>
      <input class="inputs" type="email" placeholder="E-mail" v-model="email" required />
      <input class="inputs" type="password" placeholder="Password" v-model="password" required />
      <button type="submit">Submit</button>
    </form>
  </main>

  <button type="submit" @click="signInWithGoogle">Sign In with Google.</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth'
import router from '@/router'
const email = ref('')
const password = ref('')
const errMsg = ref('')

const auth = getAuth()

const register = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.reload()
      router.go(-1)
    })
    .catch((error) => {
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

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then(() => {
      alert('Succesfull SignIn!')
      window.location.reload()
      router.push('/')
    })
    .catch((error) => {
      alert(error.message)
    })
}
</script>

<style scoped>
.inputs {
  @apply py-4 px-6 w-72 placeholder:text-orange-300 shadow-orange-100 shadow-md active:border-2 focus:outline-orange-500 focus:outline-1 active:border-none rounded-md required:border-red-400;
}
</style>
