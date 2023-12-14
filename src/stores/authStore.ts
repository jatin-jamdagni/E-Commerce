import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('auth', () => {
  const isLoggedIn = ref<boolean>(false)
  const userEmail = ref<string>()
  const userId = ref<string>()

  const getUserLogin = (isLogin: boolean) => {
    isLoggedIn.value = isLogin
  }
  const getUserMail = (email: string) => {
    userEmail.value = email
  }
  const getUserId = (id: string) => {
    userId.value = id
  }

  return {
    getUserLogin,
    isLoggedIn,
    userEmail,
    userId,
    getUserMail,
    getUserId
  }
})
