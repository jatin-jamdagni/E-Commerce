<template>
  <div class="">
    <div v-for="product in store.products" :key="product.id" class="relative flex flex-wrap">
      <div class="h-40 flex items-center justify-center">
        <img :src="product.thumbnail" :alt="product.title" class="h-72 w-72" />
        <h2>{{ product.title }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'

const store = useProductStore()
const router = useRouter()

const search = ref('')

const goToProductPage = (id: any) => {
  router.push({ name: 'ProductView', params: { id } })
}

onMounted(async () => {
  await store.fetchProductsFromAPI()
})
</script>

<style scoped></style>
