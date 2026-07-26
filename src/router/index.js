import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import { setLocale } from 'src/i18n/index.js'

export default function () {
  const router = createRouter({
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })

  router.beforeEach((to) => {
    setLocale(to.meta.locale === 'zh-TW' ? 'zh-TW' : 'en')
  })

  return router
}
