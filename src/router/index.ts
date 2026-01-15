import { createRouter, createWebHistory } from 'vue-router'

import DiscountPage from '@/pages/DiscountPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'discount',
      component: DiscountPage,
    }
  ],
})

export default router