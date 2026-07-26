import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'

export default function () {
  return createRouter({
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })
}
