<template>
  <nav class="lg:border-b border-white h-fit">
    <div
      class="py-1 px-4 bg-black w-screen border-b border-white lg:border-none flex items-center justify-center space-x-3 md:space-x-12"
    >
      <!-- Logo Image -->
      <img
        src="/logo.png"
        alt="Logo"
        class="w-[2.2em] md:w-[3em] lg:w-[4em] duration-300"
        @click="router.push('/')"
      />
      <!-- centeral Part -->
      <div class="flex items-center justify-center lg:space-x-8">
        <!-- Category Items -->
        <NavBarBottom display=" hidden lg:flex" />
        <!-- Search Bar -->
        <div class="bg-black text-white flex items-center justify-center space-x-4 lg:space-x-10">
          <div class="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              for="search"
              :class="{ fill_white: isSearchFocused, fill_gray_400: !isSearchFocused }"
              class="absolute left-4 bg-transparent transition-colors duration-150"
            >
              <path
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
              class="bg-transparent placeholder:text-gray-500 text-white rounded-full pl-10 px-4 py-2 w-[70vw] md:w-[50vw] lg:w-[25vw] font-semibold border-2 border-gray-500 focus:outline-white focus:text-white focus:placeholder:text-white focus:bg-transparent duration-150 hover:border-white"
            />
          </div>
          <!-- cart  -->
          <div>
            <button
              @click="router.push('/cart')"
              class="flex items-center"
              @focus="isCartFocused = true"
              @blur="isCartFocused = false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="28"
                class="bg-transparent fill-gray-400 focus:active:fill-white hover:fill-white duration-200"
                viewBox="0 0 576 512"
              >
                <path
                  d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- User Credentials -->
      <div class="hidden md:flex space-x-6">
        <button @click="router.push('/signIn')" v-if="!isLoggedIn">Login</button>
        <button
          @click="router.push('/signUp')"
          v-if="!isLoggedIn"
          class="px-6 py-2 bg-white text-black rounded-full font-semibold"
        >
          SignUp
        </button>
        <button
          @click="router.push('/user')"
          v-if="isLoggedIn"
          class="flex items-center text-gray-500 space-x-2"
        >
          <p class="px-3 py-1 rounded-full border-2 border-[#db8000] text-center flex items-center">
            {{ firstName ? firstName : 'Admin' }}
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" height="23" width="23" viewBox="0 0 512 512">
            <path
              fill="#db8000"
              d="M256 288A144 144 0 1 0 256 0a144 144 0 1 0 0 288zm-94.7 32C72.2 320 0 392.2 0 481.3c0 17 13.8 30.7 30.7 30.7H481.3c17 0 30.7-13.8 30.7-30.7C512 392.2 439.8 320 350.7 320H161.3z"
            />
          </svg>
        </button>
        <button @click="handleSignOut" v-if="isLoggedIn">
          <svg xmlns="http://www.w3.org/2000/svg" height="23" width="23" viewBox="0 0 512 512">
            <path
              fill="#ff0000"
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div>
      <NavBarBottom display=" block lg:hidden" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import router from '@/router'
import NavBarBottom from './NavBarBottom.vue'
import { ref } from 'vue'
const isSearchFocused = ref(false)
const searchQuery = ref('')
const isCartFocused = ref(false)
// const searchQuery = ref('')
import useUserCrediential from '@/stores/authStore'

const { firstName, isLoggedIn, handleSignOut } = useUserCrediential()
</script>

<style>
.fill_white {
  @apply fill-white;
}

.fill_gray_400 {
  @apply fill-gray-500;
}
</style>
