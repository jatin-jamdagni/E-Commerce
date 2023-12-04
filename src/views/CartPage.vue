<template>
  <main class="px-10">
    <h2>Your Cart</h2>
    <ul>
      <li v-for="item in cartItems" :key="item.id">
        <div>
          {{ item.title }} - ${{ item.price }} - Quantity: {{ item.quantity }}
          <button @click="subtractFromCart(item.id)">-</button>
          <button @click="addToCart(item)">+</button>
        </div>
      </li>
    </ul>
    <p>Total: ${{ calculateTotal() }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import type { CartItemTypes } from '@/types'

const store = useProductStore()

const cartItems = ref(store.cartItems)

onMounted(() => {
  // You can load cart items here if needed
})

// Action to subtract a quantity from the cart
const subtractFromCart = (id: number) => {
  store.removeFromCart(id)
  cartItems.value = cartItems.value.map((item) => {
    if (item.id === id) {
      item.quantity -= 1
    }
    return item
  })
}

// Action to add a quantity to the cart
const addToCart = (product: CartItemTypes) => {
  store.addToCart(product)
  cartItems.value = cartItems.value.map((item) => {
    if (item.id === product.id) {
      item.quantity += 1
    }
    return item
  })
}

// Function to calculate the total amount
const calculateTotal = () => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}
</script>
