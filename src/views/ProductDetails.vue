<template>
  <main class="px-10">
    <button
      @click="$router.go(-1)"
      class="px-2 py-1 rounded-md w-40 h-12 shadow-lg hover:shadow-md active:shadow-sm duration-200 active:bg-red-400 border-2 border-red-400 text-black active:text-white"
    >
      Back
    </button>
    <div class="p-6 w-auto">
      <!-- Product Container -->
      <div
        class="py-4 flex flex-col md:space-x-4 space-y-4 md:space-y-0 justify-center items-center md:flex-row sha"
      >
        <div class="slider bg-gray-100 rounded-md shadow-md p-2">
          <div
            class="slide duration-300"
            v-for="(slide, index) in slides"
            :key="index"
            :class="{ active: index === currentIndex }"
          >
            <img :src="slide" :alt="`Slide ${index + 1}`" class="duration-300" />
          </div>

          <button @click="prevSlide" class="nav-btn prev duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="12"
              viewBox="0 0 256 512"
              fill="#f97316"
            >
              <path
                d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"
              />
            </svg>
          </button>
          <button @click="nextSlide" class="nav-btn next duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="12"
              viewBox="0 0 256 512"
              fill="#f97316"
            >
              <path
                d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"
              />
            </svg>
          </button>
        </div>

        <div class="w-[400px] flex flex-col justify-center space-y-4 items-start px-4 py-6">
          <h2 class="font-bold truncate text-[24px]">{{ selectedProduct?.title }}</h2>
          <h2 class="font-bold truncate text-orange-500">
            {{ `${selectedProduct?.brand} - ${selectedProduct?.category}` }}
          </h2>

          <p class="font-light text-justify">{{ selectedProduct?.description }}</p>

          <h2 class="font-semibold text-[18px]">
            Price: ${{ selectedProduct?.discountPercentage }}
          </h2>
          <div class="flex space-x-8 p-2 items-center">
            <button class="btn_prod" @click="addToCartfn(selectedProduct)">Add to Cart</button>
            <button class="btn_prod">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
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
