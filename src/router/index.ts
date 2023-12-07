import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import Layout from '@/components/MainLayout.vue'
import Home from '@/views/HomePage.vue'
import Cart from '@/views/CartPage.vue'
import Product from '@/views/ProductDetails.vue'
import MyPurchase from '@/views/MyPurchase.vue'
import MyOrders from '@/views/MyOrders.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import ShopPage from '@/views/ShopPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'cart', name: 'Cart', component: Cart },
        { path: 'product/:id', name: 'ProductView', component: Product },
        { path: 'shop', name: 'Shop', component: ShopPage },
        { path: 'purchase', name: 'Purchase', component: MyPurchase, meta: { requiresAuth: true } },
        {
          path: 'order',
          name: 'Orders',
          component: MyOrders,
          meta: { requiresAuth: true }
        },
        { path: 'user', name: 'userProfile', component: ProfilePage, meta: { requiresAuth: true } }
      ]
    },

    { path: '/signIn', name: 'SignIn', component: SignIn },
    { path: '/signUp', name: 'SignUp', component: SignUp },
    { path: '/:pathMatch(.*)', name: 'notfound', component: NotFoundPage }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListner = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListner()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await getCurrentUser()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      next()
    } else {
      alert('you donnot have access')
      next('/signIn')
    }
  } else {
    if (isAuthenticated && (to.name === 'SignIn' || to.name === 'SignUp')) {
      // alert(`You are already ${to.name} .`);
      next('/')
    } else {
      next()
    }
  }
})

export default router
