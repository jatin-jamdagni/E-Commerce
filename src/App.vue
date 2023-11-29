<template>
  <NavBar />
  <nav class="flex justify-center space-x-6 items-center my-10">
    <router-link to="/">Home</router-link>
    <router-link to="/cart">Cart</router-link>
    <router-link to="/payment">Payment</router-link>
    <router-link to="/orderHistory">History</router-link>
    <router-link to="/signUp">signUp</router-link>
    <router-link to="/signIn">SignIn</router-link>
    <router-link to="/product">Product</router-link>
  </nav>
  <RouterView />
  <NavBarPhone />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/home/NavBar.vue'
import NavBarPhone from './components/home/NavBarPhone.vue'
</script>
