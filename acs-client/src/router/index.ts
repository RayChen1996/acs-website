import { createRouter, createWebHistory } from 'vue-router'
import Cards from '@/components/pages/Cards.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cards',
      name: 'Cards',
      component: Cards,
    },
  ],
})

export default router
