<template>
  <main class="relative">
    <!-- <RouterView /> -->
    <!-- <router-view /> -->

    <div class=" flex justify-center items-center h-screen w-screen bg-black">
      <p class=" font-bold text-3xl text-violet-800 text-center">
        Welcome to building new Ecommerce portal
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/authStore'
import useUserCrediential from './stores/authStoreCrediential'
import { useProductStore } from './stores/productStore'
onMounted(() => {
  useUserCrediential()
  useUserStore()
  useProductStore()
})
</script>
