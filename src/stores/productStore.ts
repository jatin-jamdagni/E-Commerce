import type { CartItemTypes, ProductTypes } from '@/types'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as unknown as ProductTypes[],
    cartItems: [] as unknown as CartItemTypes[],
    categories: [] as unknown as string[]
  }),

  actions: {
    async fetchProducts() {
      const response = await fetch('https://dummyjson.com/products')
      const json = await response.json()
      this.products = json.products
    },

    async fetchCategory() {
      const response = await fetch('https://dummyjson.com/products/categories')
      const categories = await response.json()
      this.categories = categories
    },

    addToCart(product: ProductTypes | undefined) {
      const existingItem = this.cartItems.find((item) => item.id === product?.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cartItems.push({
          ...(product as ProductTypes),
          images: product!.images || [],
          quantity: 1
        })
      }
      this.saveCartToLocalStorage()
    },

    removeFromCart(id: number) {
      this.cartItems = this.cartItems.filter((item) => {
        if (item.id === id) {
          item.quantity -= 1

          if (item.quantity === 0) {
            this.deleteCartItem(id)
            return false
          }
        }
        return true
      })

      this.saveCartToLocalStorage()
    },

    deleteCartItem(id: number) {
      const itemIndex = this.cartItems.findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        this.cartItems.splice(itemIndex, 1)
        this.saveCartToLocalStorage()
      }
    },

    updateCartItemQuantity(id: number, quantity: number) {
      const item = this.cartItems.find((item) => item.id === id)

      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          this.deleteCartItem(this.cartItems.indexOf(item))
        }
        this.saveCartToLocalStorage()
      }
    },

    loadCartFromLocalStorage() {
      const cartData = window.localStorage.getItem('cart')
      if (cartData) {
        this.cartItems = JSON.parse(cartData)
      }
    },

    saveCartToLocalStorage() {
      window.localStorage.setItem('cart', JSON.stringify(this.cartItems))
    }
  }
})
