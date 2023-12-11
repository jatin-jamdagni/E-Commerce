<template>
  <main class="space-y-10">
    <h2 class="text-center font-bold text-2xl my-4">Cart</h2>
    <ul class="max-h-[55vh] overflow-y-scroll web p-4">
      <li v-for="item in cartItems" :key="item.id">
        <div
          class="flex justify-around md:justify-between md:px-24 py-4 items-center space-x-4 border-b shadow-md"
        >
          <div class="flex items-center space-x-6">
            <figure class="w-24 h-24 flex justify-center items-center bg-gray-100">
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="mix-blend-multiply hover:cursor-pointer object-contain w-[100px]"
                @click="goToProductPage(item.id)"
              />
            </figure>
            <div class="space-y-2 py-2">
              <p
                class="font-bold hover:cursor-pointer hover:text-blue-500 hover:underline"
                @click="goToProductPage(item.id)"
              >
                {{ item.title }}
              </p>
              <p class="font-semibold">
                $ <span class="text-orange-500">{{ item.price }}.00</span>
              </p>
              <div
                class="flex w-20 justify-around items-center border-2 border-orange-500 rounded-[5px]"
              >
                <button @click="subtractFromCart(item.id)" class="btn_pm">-</button>
                <p class="">{{ item.quantity }}</p>
                <button @click="addToCart(item)" class="btn_pm">+</button>
              </div>
            </div>
          </div>
          <div class="flex space-y-10 flex-col items-center">
            <span class="font-medium">${{ item.quantity * item.price }}.00</span>

            <button @click="deleteFromCart(item.id)" class="btn_pm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="20"
                viewBox="0 0 448 512"
                class="fill-orange-500 hover:scale-110 active:blur-md duration-200"
              >
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div class="p-4 space-y-2">
      <p class="border-b pb-2">Summary</p>
      <div class="w-auto flex justify-between border-b pb-2">
        <p>Delivery Charges</p>
        <span>$ 0</span>
      </div>
      <div class="w-auto flex justify-between border-b pb-2">
        <p>Grand Total</p>
        <span>${{ calculateTotal() }}</span>
      </div>
      <button
        v-if="isLoggedIn"
        class="w-full py-1 border-2 border-orange-500 rounded-md active:bg-orange-500 active:text-white hover:shadow-md active:sm active:shadow-orange-500 shadow-lg"
      >
        Proceed to Checkout
      </button>
      <button
        v-else
        @click="router.push('/signIn')"
        class="w-full py-1 border-2 border-orange-500 rounded-md active:bg-orange-500 active:text-white hover:shadow-md active:sm active:shadow-orange-500 shadow-lg"
      >
        Login to Checkout
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import type { CartItemTypes } from '@/types'
import { useRouter } from 'vue-router'
import useUserCrediential from '@/stores/authStore'

const { isLoggedIn } = useUserCrediential()

const store = useProductStore()
const router = useRouter()
const cartItems = computed(() => store.cartItems)
onMounted(() => {
  store.loadCartFromLocalStorage()
})

const subtractFromCart = (id: number) => {
  store.removeFromCart(id)
}

const addToCart = (product: CartItemTypes) => {
  store.addToCart(product)
}
const deleteFromCart = (id: number) => {
  store.deleteCartItem(id)
}

const calculateTotal = () => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

const goToProductPage = (id: number) => {
  router.push({ name: 'ProductView', params: { id } })
}
</script>

<style scoped>
.btn_pm {
  @apply hover:text-orange-500 active:text-orange-500 hover:scale-150 duration-300;
}
</style>
