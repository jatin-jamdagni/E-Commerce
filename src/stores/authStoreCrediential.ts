import { useProductStore } from './productStore'
import { useUserStore } from './authStore'
import router from '@/router'
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { onMounted, ref } from 'vue'

export default function useUserCrediential() {
  const firstName = ref('')
  const lastName = ref('')
  const email: { value: string } = ref('')
  const userId: { value: string } = ref('')
  const isLoggedIn: { value: boolean } = ref(false)
  const auth = getAuth()

  onMounted(() => {
    const authStore = useUserStore()

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        isLoggedIn.value = true
        authStore.getUserLogin(isLoggedIn.value)
        ;[firstName.value, lastName.value] = user.displayName?.split(' ') || ''
        email.value = user.email || ''
        userId.value = user.uid || ''
        authStore.getUserId(userId.value)
        useProductStore().loadOrderFromLocalStorage()
        authStore.getUserMail(email.value)
        useProductStore().loadCartFromLocalStorage()
      } else {
        isLoggedIn.value = false
        authStore.getUserLogin(isLoggedIn.value)
      }
    })
  })

  const forgetPassword = (email: any) => {
    if (email)
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert('Password reset email sent successfully')
        })
        .catch((error) => {
          alert(error.message)
        })
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.reload()
      router.push('/')
    })
  }

  return {
    firstName,
    lastName,
    email,
    isLoggedIn,
    handleSignOut,
    forgetPassword
  }
}
