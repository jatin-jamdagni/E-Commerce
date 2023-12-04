<!-- ProductContainer.vue -->
<template>
  <main class="relative shadow-md my-5 bg-gray-100" @click="goToProductPage(productData.id)">
    <!-- Product Container -->
    <div class="p-2 space-y-2 w-80 rounded-xl">
      <figure class="flex justify-center items-center">
        <img
          :src="productData.images[0]"
          :alt="productData.title"
          class="h-[200px] bg-rem rounded-md"
        />
      </figure>
      <div class="space-y-2">
        <h2 class="font-bold truncate text-[20px]">{{ productData.title }}</h2>
        <h2 class="font-light truncate">{{ productData.description }}</h2>
        <h2 class="font-semibold text-[18px]">Price: ${{ productData.price }}</h2>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// const props = defineProps(['productData'])

defineProps({
  productData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['item-clicked'])

const goToProductPage = (productId: number) => {
  emit('item-clicked', productId)
}
</script>

<style scoped>
.bg-rem {
  mix-blend-mode: multiply;
  object-fit: contain;
}
</style>
