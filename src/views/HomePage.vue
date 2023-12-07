<template>
  <main class="px-10"></main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useProductStore } from '@/stores/productStore'
import { useRoute, useRouter } from 'vue-router'
import type { ProductTypes } from '@/types'
const store = useProductStore()
const router = useRouter()
const route = useRoute()
const slides = ref<string[] | undefined>([])
const currentIndex = ref(0)

onMounted(async () => {
  await store.fetchProducts()
})

watch(
  () => store.products,
  () => {
    updateSlides()
  }
)

const selectedProduct = computed(() => {
  const productId = Number(route.params.id)
  return store.products.find((item) => item.id !== undefined && item.id === productId)
})

const updateSlides = () => {
  slides.value = selectedProduct.value?.images
}

const addToCartfn = (product: ProductTypes | undefined) => {
  store.addToCart(product)
  router.push({ name: 'Cart' })
}

let interval: number | null = null

const startAutoSlide = () => {
  interval = setInterval(() => {
    nextSlide()
  }, 3000)
}

const stopAutoSlide = () => {
  if (interval !== null) {
    clearInterval(interval)
    interval = null
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % (slides.value?.length || 1)
}

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + (slides.value?.length || 1)) % (slides.value?.length || 1)
}

onMounted(() => {
  updateSlides()
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>
