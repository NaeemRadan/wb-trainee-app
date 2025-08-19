import { createRouter, createWebHistory } from 'vue-router'
import IncomesView from '../views/IncomesView.vue'
import OrdersView from '../views/OrdersView.vue'
import SalesView from '../views/SalesView.vue'
import StocksView from '../views/StocksView.vue'

const routes = [
  {
    path: '/',
    redirect: '/sales'
  },
  {
    path: '/incomes',
    name: 'incomes',
    component: IncomesView
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView
  },
  {
    path: '/sales',
    name: 'sales',
    component: SalesView
  },
  {
    path: '/stocks',
    name: 'stocks',
    component: StocksView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
