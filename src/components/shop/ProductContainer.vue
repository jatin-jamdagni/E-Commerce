<!-- ProductContainer.vue -->
<template>
  <main
    class="shadow-md bg-gray-100 flex rounded-xl items-center"
    @click="goToProductPage(productData.id)"
  >
    <!-- Product Container -->
    <div class="rounded-xl w-80 shadow-lg space-y-2 p-2">
      <figure class="flex justify-center items-center">
        <img
          :src="productData.images[0]"
          :alt="productData.title"
          class="h-[200px] bg-rem rounded-lg"
        />
      </figure>
      <div class="space-y-6 p-2">
        <h2 class="font-bold truncate text-[20px]">{{ productData.title }}</h2>
        <h2 class="font-light truncate">{{ productData.description }}</h2>
        <h2 class="font-semibold text-[18px]">Price: ${{ productData.price }}</h2>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
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
