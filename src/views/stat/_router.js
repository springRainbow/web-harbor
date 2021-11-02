export default [
  {
    path: '/stat',
    name: 'stat',
    meta: {
      title: '轻舟号平台',
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName:'stat' */ '@/views/admin.vue'),
    children: [
      {
        path: 'overview',
        name: 'overview',
        meta: {
          title: '数据概览',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'overview' */ '@/views/stat/pages/overview/index.vue')
      },
      {
        path: 'analysis',
        name: 'analysis',
        meta: {
          title: '内容分析',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'content' */ '@/views/stat/pages/analysis/index.vue')
      },
      {
        path: 'detail',
        name: 'detail',
        meta: {
          title: '内容详情',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'detail' */ '@/views/stat/pages/detail/index.vue')
      }
    ]
  }
];
