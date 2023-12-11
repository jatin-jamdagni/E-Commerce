<template>
  <div>
    <button
      class="py-2 border-2 w-fit px-4 border-orange-500 rounded-md active:bg-orange-500 active:text-white hover:shadow-md active:sm active:shadow-orange-500 shadow-lg"
    >
      Continue Shoping
    </button>
    <div class="p-6 flex flex-col md:flex-row">
      <div
        class="p-6 relative w-full md:h-[50%] overflow-hidden flex items-center justify-center md:w-[50%] border-2"
      >
        <div v-if="slides.length > 0" class="flex p-4 justify-center items-center">
          <transition name="fade" mode="out-in">
            <img
              :src="slides[currentIndex]"
              :key="currentIndex"
              class="object-contain h-[30vh] md:h-[45vh]"
            />
          </transition>
          <div class="absolute flex justify-between right-0 left-0">
            <button @click="prevSlide" class="text-white text-3xl ml-4 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
                <path
                  d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                />
              </svg>
            </button>
            <button @click="nextSlide" class="text-white text-3xl mr-4 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
                <path
                  d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-else class="flex p-4 justify-center items-center">
          <img
            :src="selectedProduct?.thumbnail"
            :key="selectedProduct?.title"
            class="object-contain h-[30vh] md:h-[45vh]"
          />
        </div>
      </div>
      <div class="p-6 space-y-2 md:w-[50%] flex flex-col justify-center border-2">
        <h2 class="font-bold text-xl">{{ selectedProduct?.title }}</h2>
        <div class="flex space-x-6">
          <h2 class="text-blue-500 font-semibold">
            Rating: &bigstar;{{ selectedProduct?.rating }}
          </h2>
          <h2 v-if="selectedProduct?.rating" class="text-green-500 font-semibold">In-Stock</h2>
          <h2 v-else>Out of sotck</h2>
        </div>
        <div class="flex space-x-6">
          <h2 class="font-semibold">Price: ${{ selectedProduct?.price }}</h2>

          <h2 class="text-green-500 font-semibold">
            {{ selectedProduct?.discountPercentage }}% off
          </h2>
        </div>
        <div class="flex space-x-2">
          <p class="font-semibold">Description:</p>
          <p class="">
            {{ selectedProduct?.description }}
          </p>
        </div>

        <div class="flex flex-col md:flex-row justify-around py-3 gap-y-4 md:gap-y-0">
          <button
            @click="addToCartfn(selectedProduct)"
            class="active:bg-blue-500 py-2 border-2 border-blue-500 text-blue-500 rounded-lg active:text-white px-4 duration-300"
          >
            Add to Cart
          </button>
          <button
            class="active:bg-green-500 py-2 border-2 border-green-500 text-green-500 rounded-lg active:text-white px-7 duration-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
    <h2 class="font-semibold p-6">Related Items</h2>
    <div class="flex overflow-x-scroll gap-x-6 w-screen">
      <div v-for="item in relatedItem" :key="item.id" @click="goToProductPage(item.id)" class="">
        <!-- {{ item.title }} -->
        <ProductContainer :productData="item" @item-clicked="goToProductPage" />
      </div>
    </div>
  </div>
</template>

<!-- <template>
  <main class="px-10">
    <button
      @click="$router.go(-1)"
      class="px-4 py-2 rounded-md w-auto h-12 shadow-lg hover:shadow-md active:shadow-sm duration-200 active:bg-red-400 border-2 border-red-400 text-black active:text-white mb-4"
    >
      Back
    </button>
    <div class="p-6 w-auto bg-white rounded-lg shadow-md">
      
      <div
        class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center items-center"
      >
        <div class="relative w-full md:w-1/2">
          <div class="flex overflow-hidden rounded-lg">
            <div
              class="duration-300 transition-transform ease-in-out flex"
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
</template> -->

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ProductContainer from '@/components/shop/ProductContainer.vue'

import { useProductStore } from '@/stores/productStore'
import { useRoute, useRouter } from 'vue-router'
import type { ProductTypes } from '@/types'
const store = useProductStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  await store.fetchProducts(100)
})

const selectedProduct = computed(() => {
  const productId = Number(route.params.id)
  return store.products.find((item) => item.id !== undefined && item.id === productId)
})

const relatedItem = computed(() => {
  return store.products.filter(
    (item) => item.category !== undefined && item.category === selectedProduct.value?.category
  )
})

const goToProductPage = (id: number) => {
  router.push({ name: 'ProductView', params: { id } })
  window.scrollTo(0, 0)
}

const addToCartfn = (product: ProductTypes | undefined) => {
  store.addToCart(product)
  router.push({ name: 'Cart' })
}

const slides = ref<string[]>([])
const currentIndex = ref(0)
let interval: number | null = null

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})

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
  currentIndex.value = (currentIndex.value + 1) % (slides.value.length || 1)
}

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + (slides.value.length || 1)) % (slides.value.length || 1)
}

const updateSlides = () => {
  slides.value = selectedProduct.value?.images || []
  currentIndex.value = 0 // Reset index when updating slides
}

watch(
  () => selectedProduct.value?.images,
  () => {
    updateSlides()
  }
)

updateSlides()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
