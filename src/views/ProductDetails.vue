<template>
  <button @click="$router.go(-1)">Back</button>
  <main class="p-6">
    <!-- Product Container -->
    <div class="py-6 flex justify-around">
      <figure class="h-96 w-72">
        <img
          :src="selectedProduct?.images[1]"
          :alt="selectedProduct?.title"
          class="bg-rem rounded-md w"
        />
      </figure>
      <div class="space-y-2">
        <h2 class="font-bold truncate text-[24px]">{{ selectedProduct?.title }}</h2>
        <h2 class="font-bold truncate text-orange-500">
          {{ `${selectedProduct?.brand} - ${selectedProduct?.category}` }}
        </h2>
        <h2 class="font-light truncate">{{ selectedProduct?.description }}</h2>
        <h2 class="font-semibold text-[18px]">Price: ${{ selectedProduct?.price }}</h2>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useProductStore } from '@/stores/productStore'
import { useRoute, useRouter } from 'vue-router'
const store = useProductStore()
const router = useRouter()
const route = useRoute()

const selectedProduct = computed(() => {
  return store.products.find((item) => item.id === Number(route.params.id))
})

const addToCart = () => {
  store.addToCart(selectedProduct.value)
  router.push({ name: 'CartView' })
}
</script>
