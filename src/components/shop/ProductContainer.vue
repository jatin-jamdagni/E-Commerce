<!-- ProductContainer.vue -->
<template>
  <main @click="goToProductPage(productData.id)" class="w-80 flex rounded-lg shadow-lg">
    <div
      class="relative flex flex-col rounded-xl bg-gray-50 p-4 w-full justify-center h-96 space-y-4 pb-4"
    >
      <span
        class="absolute px-4 py-2 bg-orange-200 rounded-bl-2xl rounded-tr-2xl right-0 top-0 mix-blend-exclusion font-bold"
      >
        &bigstar;
        {{ productData.rating }}</span
      >
      <img
        class="h-56 object-contain mix-blend-multiply"
        :src="productData.images[0]"
        :alt="productData.title"
      />
      <div class="w-full space-y-2">
        <h2 class="text-lg font-semibold">{{ productData.title }}</h2>
        <div class="flex space-x-4">
          <h2 class="font-semibold">$ {{ productData.price }}</h2>
          <h2 class="text-green-500">{{ productData.discountPercentage }}%</h2>
        </div>
        <h2 class="truncate">{{ productData.description }}</h2>
      </div>
    </div>
  </main>
  <!-- <main
    class=" bg-gray-100 flex rounded-xl items-center"
    @click="goToProductPage(productData.id)"
  >
    
    <div class="rounded-xl w-80  space-y-2 p-2">
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
  </main> -->
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
