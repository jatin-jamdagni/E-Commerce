<template>
  <ul
    class="flex justify-around py-4 items-center lg:shadow-none shadow-[0px_1px_0px_0px_px] shadow-gray-700"
    :class="display"
  >
    <li>Mens</li>
    <li>Women</li>
    <li>Electronics</li>
    <li>Indie</li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  display: String
})
</script>

<style scoped>
li {
  @apply px-4 py-[4px] text-center text-gray-400 hover:text-white focus:text-white font-semibold duration-300;
}
</style>
