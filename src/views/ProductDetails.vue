<template>
  <main class="px-10">
    <button
      @click="$router.go(-1)"
      class="px-4 py-2 rounded-md w-auto h-12 shadow-lg hover:shadow-md active:shadow-sm duration-200 active:bg-red-400 border-2 border-red-400 text-black active:text-white mb-4"
    >
      Back
    </button>
    <div class="p-6 w-auto bg-white rounded-lg shadow-md">
      <!-- Product Container -->
      <div
        class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center items-center"
      >
        <div class="relative w-full md:w-1/2">
          <div class="flex overflow-hidden rounded-lg">
            <div
              class="duration-300 flex transition-transform ease-in-out flex"
              v-for="(slide, index) in slides"
              :key="index"
              :class="{
                'translate-x-0': index === currentIndex,
                'translate-x-full': index < currentIndex,
                '-translate-x-full': index > currentIndex
              }"
            >
              <img :src="slide" :alt="`Slide ${index + 1}`" class="w-full h-auto object-cover" />
            </div>
          </div>

          <button
            @click="prevSlide"
            class="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
          >
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
          <button
            @click="nextSlide"
            class="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2"
          >
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

        <div class="flex flex-col justify-center space-y-4 items-start md:w-1/2 px-4 py-6">
          <h2 class="font-bold text-2xl truncate mb-2">{{ selectedProduct?.title }}</h2>
          <h2 class="font-bold text-orange-500 mb-4">
            {{ `${selectedProduct?.brand} - ${selectedProduct?.category}` }}
          </h2>

          <p class="font-light text-justify mb-4">{{ selectedProduct?.description }}</p>

          <h2 class="font-semibold text-lg mb-2">
            Price: ${{ selectedProduct?.discountPercentage }}
          </h2>
          <div class="flex space-x-4 items-center">
            <button
              class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              @click="addToCartfn(selectedProduct)"
            >
              Add to Cart
            </button>
            <button
              class="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700 focus:outline-none focus:shadow-outline-green active:bg-green-800"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div v-for="item in relatedItem" :key="item.id">
    {{ item.title }}
  </div>
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

const relatedItem = computed(() => {
  return store.products.filter(
    (item) => item.category !== undefined && item.category === selectedProduct.value?.category
  )
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
