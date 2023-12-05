<template>
  <main class="px-10">
    <h1>hlo</h1>
  </main>
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

<style scoped>
.slider {
  position: relative;
  width: 400px;
  height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide {
  display: none;
}

.slide img {
  width: 100%;
  height: auto;
}

.slide.active {
  display: block;
}

.nav-btn {
  position: absolute;
  backdrop-filter: blur(10px);
  transform: translateY(-50%);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}

.prev {
  bottom: 10px;
  left: 10px;
}

.next {
  bottom: 10px;
  right: 10px;
}

.btn_prod {
  @apply px-2 py-1 rounded-md w-40 h-12 shadow-lg hover:shadow-md active:shadow-sm duration-200 active:bg-[#f97316] border-2 border-[#f97316] text-black active:text-white;
}
</style>
