<template>
  <nav class="w-screen py-4 bg-black px-6 md:px-14 top-0 sticky z-50">
    <div class="lg:justify-around flex items-center justify-between lg:space-x-72 flex-wrap">
      <figure @click="navigateTo('/')" class="flex items-center space-x-2 cursor-pointer flex-wrap">
        <img src="/logo.png" alt="Logo" class="h-16 w-auto" />
        <h2 class="font-medium font-sans text-orange-500">Shop</h2>
      </figure>
      <div class="flex items-center space-x-3 md:space-x-10 flex-wrap">
        <ul class="hidden lg:flex space-x-8">
          <li @click="navigateTo('/')">Home</li>
          <li @click="navigateTo('/shop')">Shop</li>
          <li v-if="!isLoggedIn" @click="navigateTo('/signIn')">
            <span class="bg-orange-500 py-3 px-5 rounded-lg text-white">Login</span>
          </li>
          <li v-if="isLoggedIn" @click="navigateTo('/signUp')">My Account</li>
        </ul>

        <!-- cart -->
        <button v-if="isLoggedIn" @click="navigateTo('/cart')">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6L9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7V6"
              stroke="#131118"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.6116 3H8.3886C6.43325 3 4.76449 4.41365 4.44303 6.3424L2.77636 16.3424C2.37001 18.7805 4.25018 21 6.72194 21H17.2783C19.75 21 21.6302 18.7805 21.2238 16.3424L19.5572 6.3424C19.2357 4.41365 17.5669 3 15.6116 3Z"
              stroke="#131118"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- Pop -->
        <button @click="togglePopup" class="lg:hidden">
          <svg
            v-if="!isPopupVisible"
            :class="isLoggedIn ? ' hidden' : 'block'"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            class="duration-300 active:blur-sm active:rotate-12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.23047 6H20.2305M4.23047 12H20.2305M13.2305 18H20.2305"
              stroke="black"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-if="!isPopupVisible && isLoggedIn"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            :class="isLoggedIn ? ' block' : 'hidden'"
            fill="none"
            class="duration-300 active:blur-sm active:rotate-12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.23047 6H20.2305M4.23047 12H20.2305M13.2305 18H20.2305"
              stroke="#f97316"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-if="isPopupVisible"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#f97316"
            class="stroke-orange-500 active:-rotate-45 duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 5L5 19M5 5L19 19"
              stroke="#f97316"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
    <div
      v-if="isPopupVisible"
      class="pop p-4 lg:hidden bg-white shadow-md rounded-lg active:blur-md duration-300 flex justify-end z-50"
    >
      <ul class="list-none p-4 w-full truncate">
        <li @click="navigateTo('/')">Home</li>
        <li @click="navigateTo('/shop')">Shop</li>
        <li v-if="!isLoggedIn" @click="navigateTo('/signIn')">Login</li>
        <li v-if="!isLoggedIn" @click="navigateTo('/signUp')">Create Account</li>
        <li v-if="isLoggedIn" @click="handleLogout">Logout</li>
        <li v-if="isLoggedIn" @click="navigateTo('/user')">My Account</li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import useUserCrediential from '@/stores/authStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isPopupVisible = ref(false)
const router = useRouter()

const togglePopup = () => {
  isPopupVisible.value = !isPopupVisible.value
}

const navigateTo = (route: string) => {
  router.push(route)
  isPopupVisible.value = false
}

const { isLoggedIn, handleSignOut } = useUserCrediential()

const handleLogout = async () => {
  await handleSignOut()
  isPopupVisible.value = false
}
</script>

<style scoped>
li {
  @apply cursor-pointer text-center font-mono text-gray-600 active:text-orange-500 text-lg font-thin;
}
.pop li {
  @apply mb-2 active:scale-125 duration-150;
}
</style>
