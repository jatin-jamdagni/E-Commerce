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
