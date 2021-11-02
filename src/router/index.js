import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  return routerPush.call(this, location).catch((error) => error);
};

let routes = [
  {
    path: '/',
    redirect: { name: 'TenantList' },
    meta: {
      title: 'harbor',
      is_web: true
    }
  }
];
/**
 * require.context 实现流程自动化
 * @description 自动遍历业务侧路由
 * @param { String } directory - 读取的文件路径
 * @param { Boolean } useSubdirectories - 是否遍历文件子目录
 * @param { RegExp } regExp - 匹配文件的正则
 */
const routerContext = require.context('../views', true, /_router\.js$/);
routerContext.keys().forEach((route) => {
  const routerModule = routerContext(route);
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  routes = [...routes, ...(routerModule.default || routerModule)];
});
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
});

export { routes, router };
