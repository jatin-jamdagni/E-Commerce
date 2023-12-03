<template>
  <div class="p-4">
    <div class="flex justify-between px-4">
      <!-- Filter and Sort Buttons -->
      <button
        class="flex bg-orange-500 items-center space-x-4 py-2 px-4 rounded-lg"
        @click="togglePopup"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          viewBox="0 0 512 512"
          fill="white"
        >
          <path
            d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"
          />
        </svg>
        <span class="font-semibold text-white text-[18px]">Filter</span>
      </button>
    </div>
    <!-- <button class="btn" @click="lowToHighProducts">Sort by Price</button>
    <button @click="highToLowProducts">Sort by Price</button> -->
  </div>
  <div class="flex flex-col md:flex-row flex-wrap justify-around items-center">
    <!-- Products Display -->

    <div v-for="product in displayedProducts" :key="product.id" class="">
      <ProductContainer :productData="product" />
    </div>
  </div>

  <div
    v-if="isPopupVisible"
    class="absolute top-40 left-5 w-[95vw] h-[60vh] bg-gray-50 shadow-lg shadow-orange-100 rounded-lg z-50 flex p-4"
  >
    <div class="flex flex-col items-center space-y-10 w-[30%]">
      <h1 class="md:text-[20px] font-bold">Price Filters:</h1>
      <button class="btn" @click="filterProducts(0, 500)">0 - 500</button>
      <button class="btn" @click="filterProducts(500, 1000)">500 - 1000</button>
      <button class="btn" @click="filterProducts(1000, Infinity)">1000+</button>
    </div>
    <div
      class="flex flex-col justify-between space-y-6 border-l-2 border-black items-center w-[70%] px-4"
    >
      <span class="text-[20px] font-bold">Select Cetegories:</span>
      <div class="flex flex-col md:flex-wrap justify-between w-full overflow-x-scroll shadow-lg">
        <label
          v-for="category in store.categories"
          :key="category"
          class="font-semibold uppercase px-4 py-3 shadow-md"
        >
          <input type="checkbox" :value="category" v-model="selectedCategories" />
          {{ category }}
        </label>
      </div>
      <div class="flex justify-around items-center space-x-4">
        <button class="btn" @click="filterProductsByCategory">Show</button>
        <button @click="resetFilters" class="btn">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductContainer from '@/components/shop/ProductContainer.vue'
import type { ProductTypes } from '@/types'

const store = useProductStore()
const displayedProducts: { value: ProductTypes[] } = ref([])
const selectedCategories: { value: string[] } = ref([])

const isPopupVisible = ref(false)

const togglePopup = () => {
  isPopupVisible.value = !isPopupVisible.value
}

onMounted(async () => {
  await store.fetchProducts()
  await store.fetchCategory()
  updateDisplayedProducts()
})

const updateDisplayedProducts = () => {
  displayedProducts.value = [...store.products]
  // displayedProducts.value = [..store.prd]
  console.log(displayedProducts)
}

const filterProductsByCategory = () => {
  if (selectedCategories.value.length === 0) {
    displayedProducts.value = [...store.products]
  } else
    displayedProducts.value = store.products.filter((product) =>
      selectedCategories.value.includes(product.category)
    )
  isPopupVisible.value = !isPopupVisible.value
}

const resetFilters = () => {
  selectedCategories.value = []
  updateDisplayedProducts()
  isPopupVisible.value = !isPopupVisible.value
}

const filterProducts = (minPrice: number, maxPrice: number) => {
  displayedProducts.value = store.products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  )
  isPopupVisible.value = !isPopupVisible.value
}

const lowToHighProducts = () => {
  displayedProducts.value = [...displayedProducts.value].sort((a, b) => a.price - b.price)
}
const highToLowProducts = () => {
  displayedProducts.value = [...displayedProducts.value].sort((a, b) => b.price - a.price)
}
</script>

<style scoped>
.btn {
  @apply py-1 px-2 md:py-2 md:px-4 w-24 rounded-lg active:bg-white active:text-orange-500 bg-orange-500 text-white duration-300;
}
</style>
