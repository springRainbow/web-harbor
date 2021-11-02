/**
 * 导航守卫
 */
import VueCookie from 'vue-cookie';
import api from '@/api';
import store from '../store';
// function getQueryVariable(variable) {
//   var query = window.location.search.substring(1);
//   var vars = query.split('&');
//   for (var i = 0; i < vars.length; i++) {
//     var pair = vars[i].split('=');
//     if (pair[0] == variable) {
//       return pair[1];
//     }
//   }
//   return false;
// }
export default async (to, from, next) => {
  // 设置html title
  document.title = to.meta.title;
  // next();
  // 后台系统不需要以下功能，暂时注释
  // 获取cookie
  let authkey = VueCookie.get('authkey');
  // 进入页面,对url进行编码，防止浏览器拦截hash地址。
  let originUrl = encodeURIComponent(window.location.href);
  // 是否需要权限认证：前端路由判断，需要&&无authkey 直接跳转登录。
  if (to.meta.requiresAuth) {
    // 需要权限认证，但是没有cookie authkey
    if (!authkey) {
      // 直接跳转登录，无需走到 axios拦截器
      next({
        name: 'login'
        // query: {
        //   backurl: originUrl
        // }
      });
    } else {
      // 获取用户信息
      const res = await api.getUserInfo();
      if (res.status == 200) {
        store.dispatch('user/updateUserInfo', res.result);
        if (!to.query.u) {
          if (to.meta.harbor_id) {
            next();
          } else {
            Vue.prototype.$message.warning('请先选择要「轻舟号」');
            next({
              name: 'apply'
            });
          }
        } else {
          localStorage.setItem('HARBOR_ID', to.query.u);
          // 账号下没有轻舟号
          if (res.result.total_tenant == 0) {
            Vue.prototype.$message.warning('请先申请「轻舟号」');
            next({
              name: 'apply'
            });
          } else {
            next();
          }
        }
      } else if (res.status == 401) {
        next({
          name: 'login'
        });
      } else {
        alert(res.message);
      }
    }
  } else {
    next();
  }
};
