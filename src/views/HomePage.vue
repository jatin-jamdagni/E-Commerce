<template>
  <div class="px-10 py-2 flex flex-wrap justify-center items-center">
    <div class="md:w-1/2 lg:px-10">
      <h1 class="font-medium text-[30px] drop-shadow-lg font-['Syne']">Deals of the Month</h1>
      <p class="font-light text-md">
        Get ready for a shopping experience like never before with our Deals of the Month! Every
        purchase comes with exclusive perks and offers, making this month a celebration of savvy
        choices and amazing deals. Don't miss out! 🎁🛒.
      </p>
      <div class="countdown">
        <div class="box">
          <span class="value">{{ days }}</span>
          <span class="label">Days</span>
        </div>
        <div class="box">
          <span class="value">{{ hours }}</span>
          <span class="label">Hours</span>
        </div>
        <div class="box">
          <span class="value">{{ minutes }}</span>
          <span class="label">Minutes</span>
        </div>
        <div class="box">
          <span class="value">{{ seconds }}</span>
          <span class="label">Seconds</span>
        </div>
        <div class="w-full my-4">
          <button
            @click="router.push('/shop')"
            class="py-2 w-full px-4 font-semibold active:bg-orange-500 active:text-white text-orange-500 border-orange-500 border-2 shadow-orange-200 shadow-md rounded-md"
          >
            Start Shoping
          </button>
        </div>
      </div>
    </div>
    <img src="../assets/image-4.svg" alt="Deal" class="md:w-1/2" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const targetDate: { value: Date } = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate.value.getTime() - now.getTime()

  days.value = Math.floor(diff / (24 * 60 * 60 * 1000))
  hours.value = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  minutes.value = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  seconds.value = Math.floor((diff % (60 * 1000)) / 1000)
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})
</script>

<style scoped>
.countdown {
  @apply flex  flex-wrap py-6 px-8 justify-between items-center gap-y-5;
}

.box {
  @apply w-28 px-4 py-6 border-2 shadow-md shadow-orange-500 rounded-lg hover:shadow-sm duration-300;
}

.value {
  @apply text-[1.5rem];
}

.label {
  @apply text-[1rem] text-[#666];
}

.bgImg {
  background-image: url('../assets/image-3.svg');
}
</style>
