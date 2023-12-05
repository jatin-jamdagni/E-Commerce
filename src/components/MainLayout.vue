<template>
  <div class="relative h-full w-fit overflow-ellipsis">
    <!-- Nromal Routes -->
    <div>
      <Navbar />
      <router-view />
    </div>

    <!-- Auth Routes -->
    <router-view name="login" />
    <router-view name="signup" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './nav/NavBar.vue'
</script>
