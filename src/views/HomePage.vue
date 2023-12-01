<template>
  <div class="products-list">
    <!-- <v-text-field clearable label="Label" prepend-icon="$vuetify"></v-text-field>
    <v-row no-gutters>
      <v-col
        v-for="product in store.product"
        :key="product.id"
        cols="12"
        sm="4"
        @click="goToProductPage(product.id)"
      >
        <product-item :product-data="product" @item-clicked="goToProductPage" />
      </v-col>
    </v-row> -->
    hlo
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'

// import ProductItem from '@/components/ProductItem.vue'

const store = useProductStore()
const router = useRouter()

const search = ref('')

const goToProductPage = (id: any) => {
  router.push({ name: 'ProductView', params: { id } })
}

onMounted(async () => {
  await store.fetchProductsFromAPI()
})
</script>

<style scoped></style>
