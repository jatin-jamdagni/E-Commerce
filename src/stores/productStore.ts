// import { ProductTypes } from '@/'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    product: [],
    cartItems: []
  }),

  actions: {
    fetchProductsFromAPI() {
      fetch('https://dummyjson.com/products')
        .then((res) => res.json())
        .then((json) => {
          this.product = json.products
          console.log('hlo', this.product)
        })
    },

    searchProduct(search: string) {
      const searchTerm = search.toLowerCase()

      // Create a case-insensitive regex pattern
      const regexPattern = new RegExp(searchTerm, 'i')

      const filteredProducts = this.product.filter((item) => {
        return regexPattern.test(item?.title) || regexPattern.test(item.category)
      })

      // Assuming you want to update the state with the filtered products
      this.product = filteredProducts
    }
    // addToCart(products: any) {
    //   this.cartItems.push(products)
    // },
    // removeFromCart(id: string) {
    // //   console.log('>>>>> ID', id)
    //   this.cartItems = this.cartItems.filter((item) => item?.id !== id)
    // }
  }
})
