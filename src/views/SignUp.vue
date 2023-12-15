<template>
  <main class="flex flex-col justify-center items-center h-screen space-y-10">
    <form @submit.prevent="register" class="flex flex-col justify-center items-center space-y-10">
      <h1 class="text-center text-[32px] font-semibold">SignUp To Account</h1>

      <input
        class="inputs w-full"
        type="text"
        placeholder="First Name"
        v-model="firstName"
        required
      />
      <input class="inputs w-full" type="text" placeholder="Last Name" v-model="lastName" />

      <input class="inputs w-full" type="email" placeholder="E-mail" v-model="email" required />
      <input
        class="inputs w-80"
        type="password"
        placeholder="Password"
        v-model="password"
        required
      />
      <button
        class="w-full border-2 py-3 rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500 active:text-orange-500 active:bg-white active:border-orange-500 active:shadow-gray-500"
        type="submit"
      >
        Submit
      </button>
    </form>

    <button @click="signInWithGoogle" class="text-blue-800 underline">Sign Up with Google.</button>
  </main>
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
          window.location.reload()
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
  @apply py-4 px-6 h-fit placeholder:text-orange-300 shadow-orange-100 shadow-md active:border-2 focus:outline-orange-500 focus:outline-1 active:border-none rounded-md required:border-red-400;
}
</style>
