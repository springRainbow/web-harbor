/**
 * 全局的请求设置
 * https://npm.100tal.com/#/detial?name=%40glo%2Fkmf-axios
 */
import Vue from 'vue';
import axios from '@glo/kmf-axios';
import VueCookie from 'vue-cookie';
import { setExtra } from '../plugins/sentry';

let http = axios.create({
  loadProgressBar: true,
  headers: {},
  createOptions: {},
  request(config) {
    if (
      config.url.includes('xes-video-slice-ali.oss-cn-beijing.aliyuncs.com') ||
      config.url.includes('v.xueersi.com')
    ) {
      //上传到集团的阿里云不能有其他的headers,这里处理下
      return config;
    }
    if (VueCookie.get('authkey')) {
      config.headers['Authorization'] = 'Bearer ' + VueCookie.get('authkey');
    }
    if (localStorage.getItem('HARBOR_ID')) {
      config.headers['K-Tenant-Id'] = localStorage.getItem('HARBOR_ID');
    }
    return config;
  },
  response(res) {},
  errCallback(err, error) {
    setExtra(error);

    switch (err.code) {
      case 401:
        // 无权限
        VueCookie.delete('agent_authkey', { domain: '.qz100.com' });
        window.location.replace(`https:${process.env.VUE_APP_PRFIEX}harbor.qz100.com/login`);
        break;
      case 403:
        // 禁止访问
        Vue.prototype.$notify.error({
          title: err.code,
          message: err.msg
        });
        break;
      default:
        Vue.prototype.$notify.error({
          title: err.code,
          message: err.msg
        });
    }
  }
});
export default http;
