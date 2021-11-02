export default [
  {
    path: '/content',
    name: 'content',
    meta: {
      title: '内容管理',
      requiresAuth: true
    },
    component: () => import(/* webpackChunkName:'content' */ '@/views/admin.vue'),
    children: [
      {
        path: 'list',
        name: 'contentList',
        meta: {
          title: '内容列表',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'content' */ '@/views/content/pages/contentList/index.vue')
      },
      {
        path: 'createContent',
        name: 'createContent',
        meta: {
          title: '新建图文',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'content' */ '@/views/content/pages/contentList/createContent.vue')
      },
      {
        path: 'score',
        name: 'score',
        meta: {
          title: '分数线报录比',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'score' */ '@/views/content/pages/score/index.vue')
      },
      {
        path: 'scoredetail',
        name: 'scoredetail',
        meta: {
          title: '分数线详情',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'score' */ '@/views/content/pages/score/scoreDetail.vue')
      },
      {
        path: 'statdetail',
        name: 'statdetail',
        meta: {
          title: '报录比详情',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'score' */ '@/views/content/pages/score/statDetail.vue')
      },
      {
        path: 'books',
        name: 'books',
        meta: {
          title: '参考书管理',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'books' */ '@/views/content/pages/books/index.vue')
      },
      {
        path: 'bookscomment',
        name: 'comment',
        meta: {
          title: '编辑书评',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'comment' */ '@/views/content/pages/books/comment.vue')
      },
      {
        path: 'material',
        name: 'material',
        meta: {
          title: '素材库',
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName:'content' */ '@/views/content/pages/material/material.vue')
      }
    ]
  },
  {
    path: '/meeting',
    name: 'meeting',
    meta: {
      requiresAuth: false,
      title: '轻舟号平台'
    },
    component: () => import(/* webpackChunkName: 'meeting' */ '@/views/no-aside-layout.vue'),
    children: [
      {
        path: 'meetingtip',
        name: 'meetingtip',
        meta: {
          title: '会话链接填写规则',
          requiresAuth: false
        },
        component: () => import(/* webpackChunkName:'meetingtip' */ '@/views/content/pages/meetingtip/index.vue')
      }
    ]
  }
];
