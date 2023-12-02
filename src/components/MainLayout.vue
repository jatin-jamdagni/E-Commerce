<template>
  <div>
    <!-- Nromal Routes -->
    <Navbar />
    <router-view />

    <!-- Auth Routes -->
    <router-view name="login" />
    <router-view name="signup" />
    <router-view name="userProfile" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './nav/NavBar.vue'
</script>
