<template>
  <div class="relative h-screen w-screen overflow-y-scroll">
    <!-- Nromal Routes -->
    <Navbar />
    <router-view />

    <!-- Auth Routes -->
    <router-view name="login" />
    <router-view name="signup" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './nav/NavBar.vue'
</script>
