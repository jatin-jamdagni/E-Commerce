import { onMounted, ref } from 'vue'
import { useUserStore } from './authStore'
import type { CartItemTypes, OrderTypes, ProductTypes, TransectionTypes } from '@/types'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
  const products = ref<ProductTypes[]>([])
  const cartItems = ref<CartItemTypes[]>([])
  const orders = ref<OrderTypes[]>([])
  const transections = ref<TransectionTypes[]>([])
  const categories = ref<string[]>([])

  const fetchProduct = async (limit?: number, skip?: number) => {
    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit ? limit : 20}&skip=${skip ? skip * 2 : 0}`
    )
    const json = await response.json()
    products.value = json.products
  }

  const fetchCategory = async () => {
    const response = await fetch('https://dummyjson.com/products/categories')
    const category = await response.json()
    categories.value = category
  }

  const addToCart = (product: ProductTypes | undefined) => {
    const existingItem = cartItems.value.find((item) => item.id === product?.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.value.push({
        ...(product as ProductTypes),
        images: product!.images || [],
        quantity: 1
      })
    }
    saveCartToLocalStorage()
  }

  const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter((item) => {
      if (item.id === id) {
        item.quantity -= 1

        if (item.quantity === 0) {
          deleteCartItem(id)
          return false
        }
      }
      return true
    })

    saveCartToLocalStorage()
  }

  const deleteCartItem = (id: number) => {
    const itemIndex = cartItems.value.findIndex((item) => item.id === id)

    if (itemIndex !== -1) {
      cartItems.value.splice(itemIndex, 1)
      saveCartToLocalStorage()
    }
  }

  const updateCartItemQuantity = (id: number, quantity: number) => {
    const item = cartItems.value.find((item) => item.id === id)

    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        deleteCartItem(cartItems.value.indexOf(item))
      }
      saveCartToLocalStorage()
    }
  }

  const loadCartFromLocalStorage = () => {
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      const cartData = window.localStorage.getItem(userStore.userEmail || '')
      console.log()
      if (cartData) {
        cartItems.value = JSON.parse(cartData)
      }
    } else {
      const cartData = window.localStorage.getItem('cart')
      console.log()
      if (cartData) {
        cartItems.value = JSON.parse(cartData)
      }
    }
  }

  const saveCartToLocalStorage = () => {
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      window.localStorage.setItem(userStore.userEmail || '', JSON.stringify(cartItems.value))
    } else {
      window.localStorage.setItem('cart', JSON.stringify(cartItems.value))
    }
  }

  const addTrasection = (totalTransectionAmt: number | 0) => {
    const date = new Date()
    const userStore = useUserStore()
    const id = `${date.getTime()}-${userStore.userEmail || ''}`

    const transaction: TransectionTypes = {
      transectionId: id,
      orderList: cartItems.value,
      totalTransection: totalTransectionAmt
    }
    transections.value.push(transaction)

    saveOrderToLocalStorage()
  }

  const loadOrderFromLocalStorage = () => {
    const userStore = useUserStore()
    const transectionData = window.localStorage.getItem(`${userStore.userId || ''}`)

    if (transectionData) {
      transections.value = JSON.parse(transectionData)
    }
  }

  const saveOrderToLocalStorage = () => {
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      window.localStorage.setItem(`${userStore.userId || ''}`, JSON.stringify(transections.value))
    } else {
      alert('Please Login First')
    }
  }

  return {
    fetchProduct,
    fetchCategory,
    addToCart,
    removeFromCart,
    deleteCartItem,
    updateCartItemQuantity,
    loadCartFromLocalStorage,
    saveCartToLocalStorage,
    loadOrderFromLocalStorage,
    saveOrderToLocalStorage,
    addTrasection,
    products,
    cartItems,
    categories,
    transections
  }
})
