<template>
  <h1>j</h1>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore'
import { onMounted } from 'vue'
const store = useProductStore()
onMounted(async () => {
  await store.fetchCategory()
})

const props = defineProps({
  selectedCategories: { required: true },
  filterProductsByCategory: { type: () => {} },
  resetFilters: { type: () => {}, required: true }
})
</script>
