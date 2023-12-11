<template>
  <div v-if="isLoggedIn" class="p-6 flex flex-col justify-center gap-y-5 h-[74vh]">
    <h1 class="font-semibold text-[30px] text-slate-600">
      Name: <span class="text-black"> {{ firstName }} {{ lastName }}</span>
    </h1>
    <h1 class="font-semibold text-[30px] text-slate-600">
      Email: <span class="text-black"> {{ email }}</span>
    </h1>
    <button
      @click="handleSignOut"
      class="w-full py-2 border-2 border-orange-500 rounded-md active:bg-orange-500 active:text-white text-orange-500 hover:shadow-md active:sm active:shadow-orange-500 shadow-lg text-lg"
    >
      Logout
    </button>
  </div>
  <div v-else class="">
    <button
      @click="router.push('/signIn')"
      class="w-full py-2 border-2 border-orange-500 rounded-md active:bg-orange-500 active:text-white hover:shadow-md active:sm active:shadow-orange-500 shadow-lg"
    >
      Please login
    </button>
  </div>
</template>

<script setup lang="ts">
import useUserCrediential from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const { firstName, lastName, email, isLoggedIn, handleSignOut } = useUserCrediential()
</script>
