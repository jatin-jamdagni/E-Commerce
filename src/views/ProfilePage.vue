<template>
  <div class="flex md:lex-col-reverse flex-row h-[70vh] w-full border-2 border-red-400 relative">
    <div class="flex flex-col w-full justify-start">
      <button @click="showContainer(1)">Profile</button>
      <button @click="showContainer(2)">My Transections</button>
      <button @click="router.push('/cart')">My Cart</button>
      <button
        @click="handleSignOut"
        class="w-full py-2 border-2 border-orange-500 rounded-md active:bg-orange-500 active:text-white text-orange-500 hover:shadow-md active:sm active:shadow-orange-500 shadow-lg text-lg"
      >
        Logout
      </button>
    </div>

    <div v-if="activeContainer === 1" class="w-full">
      <div class="p-6 flex flex-col justify-center gap-y-5 h-[74vh] overflow-y-scroll">
        <h1 class="font-semibold text-[30px] text-slate-600">
          Name: <span class="text-black"> {{ firstName }} {{ lastName }}</span>
        </h1>
        <h1 class="font-semibold text-[30px] text-slate-600">
          Email: <span class="text-black"> {{ email }}</span>
        </h1>
      </div>
    </div>

    <div v-if="activeContainer === 2" class="w-full">
      <div v-for="(transaction, transactionIndex) in store.transections" :key="transactionIndex">
        <div class="flex flex-col p-4 border-2 mb-4">
          <h1 class="font-semibold text-orange-500">
            {{ date(transaction.transectionId) }}
          </h1>
          <h1 class="font-semibold">
            Transection ID: <span class="text-gray-600">{{ transaction.transectionId }}</span>
          </h1>
          <h1 class="font-semibold">
            Transection Amount:
            <span class="text-gray-600">${{ transaction.totalTransection }}</span>
          </h1>
          <button
            class="px-4 py-2 border-2 font-semibold rounded-lg"
            @click="handleOpenPopUp(transactionIndex)"
          >
            Summary {{ transaction.transectionId }}
          </button>

          <!-- Order List -->
          <div
            :class="[
              openPopUps[transactionIndex] ? 'absolute' : 'hidden',
              'right-10 left-10 top-10 bottom-10 px-4 py-12 bg-gray-100 shadow-xl rounded-xl '
            ]"
          >
            <div class="flex flex-col md:flex-row w-full justify-around">
              <h1 class="font-semibold text-orange-500">
                {{ date(transaction.transectionId) }}
              </h1>
              <h1 class="font-semibold">
                Transection ID: <span class="text-gray-600">{{ transaction.transectionId }}</span>
              </h1>
              <h1 class="font-semibold">
                Transection Amount:
                <span class="text-gray-600">${{ transaction.totalTransection }}</span>
              </h1>
            </div>
            <div class="overflow-y-scroll py-4 h-full border-2 w-full">
              <button
                @click="handleClosePopUp(transactionIndex)"
                class="absolute top-5 right-5 fill-orange-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  width="20"
                  viewBox="0 0 384 512"
                >
                  <path
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  />
                </svg>
              </button>

              <div class="web p-4 w-full">
                <div v-for="(order, index) in transaction.orderList" :key="index">
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
                      <div class="flex space-y-10 flex-col items-center w-24 h-24">
                        <span class="font-medium">${{ order.quantity * order.price }}.00</span>
                        <span class="font-medium">Quantity: {{ order.quantity }}</span>
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
