// import { ProductTypes } from '@/'
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
    // async searchProducts(query: string) {
    //   const response = await fetch(`https://dummyjson.com/products/search?q=${query}`)
    //   const searchProduct = await response.json()
    //   this.products = []
    //   this.products = searchProduct
    // }
    // searchProduct(search: string) {
    //   const searchTerm = search.toLowerCase()

    //   // Create a case-insensitive regex pattern
    //   const regexPattern = new RegExp(searchTerm, 'i')

    //   const filteredProducts = this.product.filter((item) => {
    //     return regexPattern.test(item?.title) || regexPattern.test(item.category)
    //   })

    //   // Assuming you want to update the state with the filtered products
    //   this.product = filteredProducts
    // }
    addToCart(products: any) {
      this.cartItems.push(products)
    },
    removeFromCart(id: number) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id)
    }
  }
})
