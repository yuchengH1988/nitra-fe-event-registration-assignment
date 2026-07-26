function createRegistrationRoute(path, name, locale) {
  return {
    path,
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name,
        meta: { locale },
        component: () => import('../pages/IndexPage.vue'),
      },
    ],
  }
}

export default [
  createRegistrationRoute('/', 'registration-en', 'en'),
  createRegistrationRoute('/zh', 'registration-zh', 'zh-TW'),
]
