export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '轻舟号平台',
      requiresAuth: false,
      harbor_id: true,
      is_web: true
    },
    component: () => import(/* webpackChunkName:'login' */ './index.vue')
  },
  {
    path: '/login/agreement',
    name: 'loginAgreement',
    meta: {
      title: '轻舟号平台',
      requiresAuth: false,
      harbor_id: true,
      is_web: true
    },
    component: () => import(/* webpackChunkName:'login' */ './agreement.vue')
  }
];
