import router from '@/router'
import { getAuth, onAuthStateChanged, signOut, type Auth } from 'firebase/auth'
import { onMounted, ref } from 'vue'

export default function useUserCrediential() {
  const firstName: { value: string } = ref('')
  const lastName: { value: string } = ref('')
  const email: { value: string } = ref('')

  const isLoggedIn: { value: boolean } = ref(false)

  let auth: Auth
  onMounted(() => {
    auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLoggedIn.value = true
        ;[firstName.value, lastName.value] = user.displayName?.split(' ') || ''
        email.value = user.email || ' '
      } else {
        isLoggedIn.value = false
      }
    })
  })

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
    handleSignOut
  }
}
