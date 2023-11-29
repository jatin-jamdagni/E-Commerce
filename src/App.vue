<template>
  <NavBar />
  <RouterView />
  <NavBarPhone />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/home/NavBar.vue'
import NavBarPhone from './components/home/NavBarPhone.vue'
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut, type Auth } from 'firebase/auth'
import router from './router'

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
