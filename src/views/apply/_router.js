export default [
  {
    path: '/apply',
    name: 'apply',
    redirect: { name: 'TenantList' },
    meta: {
      title: '轻舟号平台',
      requiresAuth: true,
      harbor_id: true,
      is_web: true // 前台，不需要处理菜单
    },
    component: () => import(/* webpackChunkName:'apply' */ './index.vue'),
    children: [
      {
        path: 'list',
        name: 'TenantList',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true,
          harbor_id: true,
          is_web: true // 前台，不需要处理菜单
        },
        component: () => import(/* webpackChunkName:'apply' */ '@/views/apply/pages/list.vue')
      },
      {
        path: 'process/:step?',
        name: 'applyProcess',
        meta: {
          title: '轻舟号平台',
          requiresAuth: true,
          harbor_id: true,
          is_web: true
        },
        component: () => import(/* webpackChunkName:'apply' */ '@/views/apply/pages/applyProcess.vue')
        // beforeEnter: (to, from, next) => {
        //   // ...
        //   // console.log(to);
        //   // console.log(from);
        //   // next()
        //   if (from.path == '/' && to.path == '/apply/process/2' && !to.query.u) {
        //     next({
        //       path: '/apply/process/1'
        //     });
        //   }else{
        //     next()
        //   }
        //   // if (from.path == '/' && to.path != /process/1) {
        //   //   next({
        //   //     name: 'applyProcess',
        //   //     params: {
        //   //       step: 1
        //   //     }
        //   //   });
        //   // } else {
        //   //   next();
        //   // }
        // }
      }
    ]
  }
];
