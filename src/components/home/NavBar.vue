<template>
  <div class="top-0 flex flex-col-reverse md:flex-row justify-center items-center space-x-4 py-4">
    <router-link to="/signUp" v-if="!isLoggedIn">signUp</router-link>
    <router-link to="/signIn" v-if="!isLoggedIn">SignIn</router-link>
    <div class="hidden lg:block">
      <button @click="handleSignOut" v-if="isLoggedIn">SignOut</button>
      <button @click="handleSignOut" v-if="isLoggedIn">Profile</button>
    </div>
    <ul class="flex space-x-4">
      <li @click="router.push('/cart')">Home</li>
      <li>Women</li>
      <li>Men</li>
      <li>Electronics</li>
      <li>Home and Kitchen</li>
    </ul>
    <div class="flex">
      <span>
        <input type="text" placeholder="Search.." class="bg-white py-1 px-4 border-2" />
      </span>
      <button @click="router.push('/cart')">Cart</button>
      <button>Account</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut, type Auth } from 'firebase/auth'
import router from '@/router'
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
