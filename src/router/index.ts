import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import CartPage from '@/views/CartPage.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component:()=> import('@/views/HomePage.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: ()=> import('@/views/CartPage.vue'),
    },
    {
      path: '/product',
      name: 'Product',
      component: ()=> import('@/views/ProductDetails.vue'),
    },
    {
      path: '/payment',
      name: 'Payment',
      component: ()=> import('@/views/PaymentPage.vue'),
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/orderHistory',
      name: 'OrderHistory',
      component: ()=> import('@/views/OrderHistory.vue'),
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: ()=> import('@/views/SignIn.vue')
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: ()=> import('@/views/SignUp.vue'),
    },
  ]
});

const getCurrentUser = () =>{
  return new Promise((resolve, reject)=>{
    const removeListner = onAuthStateChanged(
      getAuth(), (user)=>{
        removeListner();
        resolve(user);
      }, reject
    )
  })
}

router.beforeEach(async (to, from, next)=>{
  if(to.matched.some( (record)=> record.meta.requiresAuth)){
    
  if(await getCurrentUser()){
    next();
  }else{
    alert('you donnot have access')
    next('/signIn')
  }

}else{
  next();
}
})

export default router;
