import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import Layout from '@/components/MainLayout.vue';
import Home from '@/views/HomePage.vue';
import Cart from '@/views/CartPage.vue';
import Product from '@/views/ProductDetails.vue';
import Payment from '@/views/PaymentPage.vue';
import OrderHistory from '@/views/OrderHistory.vue';
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import NotFoundPage from '@/views/NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes : [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'cart', name: 'Cart', component: Cart },
        { path: 'product', name: 'Product', component: Product },
        { path: 'payment', name: 'Payment', component: Payment, meta: { requiresAuth: true } },
        { path: 'orderHistory', name: 'OrderHistory', component: OrderHistory, meta: { requiresAuth: true } },
      ],
    },
    { path: '/user', name: 'userProfile', component: ProfilePage, meta: { requiresAuth: true } },
    { path: '/signIn', name: 'SignIn', component: SignIn },
    { path: '/signUp', name: 'SignUp', component: SignUp },
    { path: '/:pathMatch(.*)', component: NotFoundPage },
  ]});
  
//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       component:()=> import('@/views/HomePage.vue'),
//     },
//     {
//       path: '/cart',
//       name: 'Cart',
//       component: ()=> import('@/views/CartPage.vue'),
//     },
//     {
//       path: '/product',
//       name: 'Product',
//       component: ()=> import('@/views/ProductDetails.vue'),
//     },
//     {
//       path: '/payment',
//       name: 'Payment',
//       component: ()=> import('@/views/PaymentPage.vue'),
//       meta:{
//         requiresAuth: true
//       }
//     },
//     {
//       path: '/orderHistory',
//       name: 'OrderHistory',
//       component: ()=> import('@/views/OrderHistory.vue'),
//       meta:{
//         requiresAuth: true
//       }
//     },
//     {
//       path: '/signIn',
//       name: 'SignIn',
//       component: ()=> import('@/views/SignIn.vue')
//     },
//     {
//       path: '/signUp',
//       name: 'SignUp',
//       component: ()=> import('@/views/SignUp.vue'),
//     },
//     {
//       path: "/user",
//       name: "userProfile",
//       component: () => import('@/views/ProfilePage.vue'),
//       meta:{
//         requiresAuth: true
//       }
//     },
//     { path: '/:pathMatch(.*)', component: ()=> import('@/views/NotFoundPage.vue') },
//   ]
// });

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
  const isAuthenticated = await getCurrentUser();
  if(to.matched.some( (record)=> record.meta.requiresAuth)){

  if(isAuthenticated){
    next();
  }else{
    alert('you donnot have access')
    next('/signIn')
  }

}else{
  if (isAuthenticated && (to.name === 'SignIn' || to.name === 'SignUp')) {
    // alert(`You are already ${to.name} .`);
    next('/');
}

else{
  next();
}}}
)

export default router;
