<template>
  <main class="relative">
    <!-- <RouterView /> -->
    <router-view />
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
