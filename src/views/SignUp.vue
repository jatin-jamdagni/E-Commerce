<template>
  <main class="flex flex-col justify-center items-center h-screen space-y-10">
    <form @submit.prevent="register" class="flex flex-col justify-center items-center space-y-10">
      <h1 class="text-center text-[32px] font-semibold">SignUp To Account</h1>
      <div class="flex flex-col md:flex-row w-auto space-y-10 md:space-y-0 md:space-x-4">
        <input
          class="inputs w-40"
          type="text"
          placeholder="First Name"
          v-model="firstName"
          required
        />
        <input class="inputs w-40" type="text" placeholder="Last Name" v-model="lastName" />
      </div>
      <input class="inputs w-80" type="email" placeholder="E-mail" v-model="email" required />
      <input
        class="inputs w-80"
        type="password"
        placeholder="Password"
        v-model="password"
        required
      />
      <button
        class="py-4 px-6 w-80 font-semibold active:bg-orange-500 active:text-white text-orange-500 border-orange-500 border-2 shadow-orange-200 shadow-md rounded-md"
        type="submit"
      >
        Submit
      </button>
    </form>

    <button @click="signInWithGoogle">Sign In with Google.</button>
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
