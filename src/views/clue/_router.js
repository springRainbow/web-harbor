export default [
  {
    path: '/clue',
    name: 'clue',
    meta: {
      title: '轻舟号平台',
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName:'clue' */ '@/views/admin.vue'),
    children: [
      {
        path: 'list',
        name: 'clueList',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'setting' */ '@/views/clue/pages/index.vue')
      },
      {
        path: 'follow-user',
        name: 'follow-user',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'setting' */ '@/views/clue/pages/focuslist/index.vue')
      }
    ]
  }
];
