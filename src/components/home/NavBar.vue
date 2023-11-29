<template>
  <div
    class="flex flex-col-reverse md:flex-row lg:justify-center items-center lg:space-x-4 py-4 bg-[#994D1C]"
  >
    <!-- <router-link to="/signUp" v-if="!isLoggedIn">signUp</router-link>
    <router-link to="/signIn" v-if="!isLoggedIn">SignIn</router-link>
    <div class="hidden lg:block">
      <button @click="handleSignOut" v-if="isLoggedIn">SignOut</button>
      <button @click="handleSignOut" v-if="isLoggedIn">Profile</button>
    </div> -->
    <!-- <ul class="flex space-x-6 overflow-hidden bg-transparent">
      <li @click="router.push('/')">Home</li>
      <li>Women</li>
      <li>Men</li>
      <li>Electronics</li>
    </ul> -->
    <div class="flex justify-evenly space-x-6 bg-transparent">
      <div class="flex items-center relative bg-transparent">
        <input
          type="text"
          placeholder="Search.."
          class="bg-[#E48F45] py-2 px-4 rounded-md w-80 text-[#6B240C] font-medium placeholder:text-[#F5CCA0]"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="16"
          viewBox="0 0 512 512"
          class="absolute right-4 bg-transparent"
          fill="#6B240C"
        >
          <path
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
          />
        </svg>
      </div>
      <button @click="router.push('/cart')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="22"
          fill="#6B240C"
          class="bg-transparent"
          viewBox="0 0 576 512"
        >
          <path
            d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { getAuth, onAuthStateChanged, signOut, type Auth } from 'firebase/auth'
import { onMounted, ref } from 'vue'

const isLoggedIn = ref(false)

let auth: Auth

onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/')
  })
}
</script>
