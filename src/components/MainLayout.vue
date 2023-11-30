<template>
  <div>
    <!-- Common Navbar -->
    <Navbar />

    <!-- Main Content -->
    <router-view />

    <!-- Additional named views for login and signup -->
    <router-view name="login" />
    <router-view name="signup" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './home/NavBar.vue'
</script>
