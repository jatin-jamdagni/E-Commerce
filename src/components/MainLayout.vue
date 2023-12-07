<template>
  <div class="relative h-full w-fit overflow-hidden">
    <!-- Nromal Routes -->
    <Navbar />
    <div class="overflow-hidden">
      <router-view />
    </div>
    <FooterBar />

    <!-- Auth Routes -->
    <router-view name="login" />
    <router-view name="signup" />
    <router-view name="notfound" />
  </div>
</template>

<script setup lang="ts">
import FooterBar from './nav/FooterBar.vue'
import Navbar from './nav/NavBar.vue'
</script>
