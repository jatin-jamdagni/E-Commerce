import type router from '@/router';
<template>
  <video autoplay muted loop class="min-h-full min-w-full">
    <source src="/notfound.mp4" />
  </video>
  <div class="flex flex-col justify-center items-center w-auto">
    <h1 class="text-center text-[28px] font-semibold">
      <span class="text-orange-500">Bhai! </span>Tu
      <span class="uppercase text-red-600">not found</span> page pe aagya.
    </h1>
    <img src="/no-results.png" alt="Not Found" class="h-56 drop-shadow-xl hover:drop-shadow-sm" />
    <div class="flex space-x-10">
      <button
        @click="router.go(-1)"
        class="align-middle border-2 rounded-md px-4 py-2 border-orange-500 text-orange-500 active:bg-orange-500 active:text-white hover:bg-orange-500 hover:text-white duration-300"
      >
        Back
      </button>

      <button
        @click="router.push('/')"
        class="align-middle border-2 rounded-md px-4 py-2 border-blue-500 text-blue-500 active:bg-blue-500 active:text-white hover:bg-blue-500 hover:text-white duration-300"
      >
        Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
