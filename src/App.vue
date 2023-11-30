<template>
  <main class="relative w-screen h-screen overflow-hidden">
    <NavBar />
    <!-- <RouterView /> -->
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/home/NavBar.vue'
</script>
