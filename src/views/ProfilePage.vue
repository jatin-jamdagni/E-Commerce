<template>
  <div
    class="flex flex-col-reverse md:flex-row h-[73.5vh] lg:h-[68.8vh] w-full border-2 border-red-400 items-start relative"
  >
    <div class="flex flex-col w-full h-full justify-center items-center gap-y-4">
      <button @click="showContainer(1)" class="btn">Profile</button>
      <button @click="showContainer(2)" class="btn">My Transections</button>
      <button @click="router.push('/cart')" class="btn">My Cart</button>
      <button
        @click="handleSignOut"
        class="w-full border-2 py-3 rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500 active:text-orange-500 active:bg-white active:border-orange-500 active:shadow-gray-500"
      >
        Logout
      </button>
    </div>

    <div v-if="activeContainer === 1" class="w-full h-full">
      <div class="p-6 flex flex-col justify-center gap-y-5 h-full overflow-y-scroll">
        <h1 class="font-semibold text-[28px] text-slate-600">
          Name: <span class="text-black"> {{ firstName }} {{ lastName }}</span>
        </h1>
        <h1 class="font-semibold text-[28px] text-slate-600">
          Email: <span class="text-black"> {{ email }}</span>
        </h1>
      </div>
    </div>

    <div v-if="activeContainer === 2" class="w-full h-full overflow-y-scroll">
      <div v-for="(transaction, transactionIndex) in store.transections" :key="transactionIndex">
        <div class="flex flex-col p-4 border-2 mb-4">
          <h1 class="font-semibold text-orange-500">
            {{ date(transaction.transectionId) }}
          </h1>
          <h1 class="font-semibold border-b-2 px-4">
            Transection ID: <br />
            <span class="text-gray-600">{{ transaction.transectionId }}</span>
          </h1>
          <h1 class="font-semibold border-b-2 px-4">
            Transection Amount: <br />
            <span class="text-gray-600">$ {{ transaction.totalTransection }}</span>
          </h1>
          <button
            class="px-4 py-2 border-2 font-semibold rounded-lg mt-4"
            @click="handleOpenPopUp(transactionIndex)"
          >
            Summary
          </button>

          <!-- Order List -->
          <div
            :class="[
              openPopUps[transactionIndex] ? 'absolute' : 'hidden',
              'right-2 left-2 top-4 bottom-0 px-4 py-12 bg-gray-100 shadow-2xl shadow-orange-500 rounded-xl border-2 border-orange-500 '
            ]"
          >
            <div class="flex flex-col md:flex-row w-full justify-around">
              <h1 class="font-semibold text-orange-500">
                {{ date(transaction.transectionId) }}
              </h1>
              <h1 class="font-semibold">
                Transection ID: <br class="md:hidden" />
                <span class="text-gray-600">{{ transaction.transectionId }}</span>
              </h1>
              <h1 class="font-semibold">
                Transection Amount:
                <span class="text-gray-600">${{ transaction.totalTransection }}</span>
              </h1>
            </div>
            <button
              @click="handleClosePopUp(transactionIndex)"
              class="absolute top-5 right-5 fill-orange-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="20" viewBox="0 0 384 512">
                <path
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                />
              </svg>
            </button>
            <div class="py-4 border-2 w-full h-[50vh] relative">
              <h1 class="font-semibold text-center">Ordered Items :</h1>
              <div class="py-1 w-full absolute h-full overflow-y-scroll">
                <div v-for="order in transaction.orderList" :key="order.id">
                  <div
                    class="flex justify-around md:justify-between md:px-24 py-4 items-center space-x-4 border-b shadow-md w-full"
                  >
                    <div class="flex items-center justify-around space-x-6 w-full">
                      <figure class="w-24 h-24 flex justify-center items-center bg-gray-100">
                        <img
                          :src="order.thumbnail"
                          :alt="order.title"
                          class="mix-blend-multiply hover:cursor-pointer object-contain w-[100px]"
                          @click="goToProductPage(order.id)"
                        />
                      </figure>
                      <div class="space-y-2 py-2 w-[20vw] h-28">
                        <p
                          class="font-bold hover:cursor-pointer hover:text-blue-500 hover:underline truncate"
                          @click="goToProductPage(order.id)"
                        >
                          {{ order.title }}
                        </p>
                        <p class="font-semibold">
                          $ <span class="text-orange-500">{{ order.price }}.00</span>
                        </p>
                      </div>
                      <div class="flex space-y-10 flex-col items-center w-28 h-24">
                        <span class="font-medium">Quantity: {{ order.quantity }}</span>
                        <span class="font-medium"
                          >Total Price: <br />${{ order.quantity * order.price }}.00</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import useUserCrediential from '@/stores/authStoreCrediential'
import { useProductStore } from '@/stores/productStore'
const activeContainer = ref<number | null>(null)

const store = useProductStore()
const openPopUps = ref<boolean[]>(Array(store.transections.length).fill(false))

const router = useRouter()

const showContainer = (containerNumber: number) => {
  activeContainer.value = containerNumber
}
onMounted(() => {
  store.loadOrderFromLocalStorage()
})

const date = (transectionId: string) => {
  const [timestamp, email] = transectionId.split('-')
  email
  return new Date(parseInt(timestamp))
}
onMounted(async () => {
  activeContainer.value = 1
})

const handleOpenPopUp = (transactionIndex: number) => {
  openPopUps.value = openPopUps.value.map((_, index) => index === transactionIndex)
}

const handleClosePopUp = (transactionIndex: number) => {
  openPopUps.value[transactionIndex] = false
}

const goToProductPage = (id: number) => {
  router.push({ name: 'ProductView', params: { id } })
}
const { firstName, lastName, email, handleSignOut } = useUserCrediential()
</script>

<style scoped>
.btn {
  @apply w-full border-2 py-3 rounded-lg active:bg-orange-500 active:text-white shadow-md active:shadow-orange-500 active:border-white text-orange-500 bg-white border-orange-500 shadow-gray-500;
}
</style>
