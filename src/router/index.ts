import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import CartPage from '@/views/CartPage.vue';
import ProductDetails from '@/views/ProductDetails.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartPage
    },
    {
      path: '/product',
      name: 'Product',
      component: ProductDetails
    },
    {
      path: '/payment',
      name: 'Payment',
      component: ()=> import('@/views/PaymentPage.vue'),
    },
    {
      path: '/orderHistory',
      name: 'OrderHistory',
      component: ()=> import('@/views/OrderHistory.vue')
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: ()=> import('@/views/SignIn.vue')
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: ()=> import('@/views/SignUp.vue')
    },
   
  ]
})

export default router;
