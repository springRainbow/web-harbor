export default [
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '轻舟号平台',
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName:'setting' */ '@/views/admin.vue'),
    children: [
      {
        path: 'staff',
        name: 'Staff',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'setting' */ '@/views/setting/pages/staff.vue')
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'setting' */ '@/views/setting/pages/role.vue')
      },
      {
        path: 'info',
        name: 'Info',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'setting' */ '@/views/setting/pages/info.vue')
      }
    ]
  }
];
