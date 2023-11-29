<template>
  <NavBar />
  <RouterView />
  <NavBarPhone />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/home/NavBar.vue'
import NavBarPhone from './components/home/NavBarPhone.vue'
</script>
