import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import guard from '@/utils/guard';
import http from '@/utils/http';
import './plugins/element.js';
import './plugins/lazyload';
import '@/components';
import VueCookie from 'vue-cookie';
import ossUpload from '@glo/kmf-oss-upload';
import qzTable from '@qz/table';
import vuescroll from 'vuescroll/dist/vuescroll-native';
import XesLoggerSDK from '@xes/xes_fe_log';
import message from '@/components/message/src/message.js';
import ImgPreview from 'mty-img-preview';
import { MessageBox } from 'element-ui';

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$QzMessage = message;
Vue.use(ImgPreview);
Vue.use(qzTable);
// 注册组件库
Vue.use(ossUpload);
Vue.use(vuescroll);
Vue.prototype.$vuescrollConfig = {
  scrollPanel: {
    scrollingX: false
  },
  bar: {
    background: '#EBEBEB'
    // keepShow: false
  }
};
// 进入路由前校验
router.beforeEach((to, from, next) => {
  guard(to, from, next);
});

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.$cookie = VueCookie;
Vue.prototype.$bus = new Vue(); //全局引入事件车
if (process.env.NODE_ENV == 'production') {
  Vue.use(XesLoggerSDK, {
    cacheUploader: {
      interval: 10000,
      batch: 5
    },
    common: {
      // 需要传自定义参数,请写在common中
      eventid: 'harbor-web', //业务自定义的事件字段 例如 huatuoweb
      page: 'harbor-admin'
    },
    param: {},
    clickMsg: {
      open: false
    },
    // 是否自动上报展现日志开关，如果自动上报需要把展现日志必备参数设置到window.courseDatanSerach上，如果不自动上报，则可以在业务想要的地方使用loadMsg方法自主上报展现日志
    loadMsg: {
      open: false
    },
    hashchange: {
      open: false,
      pvid: 'hash',
      loadParam: {
        //   'index': {
        //     event_properties: {
        //       'event_type': 'pv',
        //       'event_id': 'APP',
        //       '1111111': '22222'
        //     }
        //   },
        //   'DMP': {
        //     event_properties: {
        //       'event_type': 'pv',
        //       'event_id': 'DMP',
        //       '1111111': '22222'
        //     }
        //   },
        //   'path/a': { 'key1': 'zzz' }
      }
    },
    network: {
      open: true,
      sample: 1
    },
    runtime: {
      open: true,
      sample: 1
    },
    resource: {
      open: true,
      sample: 1
    },
    performance: {
      open: true,
      sample: 1
    },
    vue: {
      errorHandler: true //vue可以开启，react需要删除
    },
    appid: {
      // 正式环境
      'harbor.qz100.com': {
        appid: '1004143',
        appkey: 'ff133dd59130051dd77314af95273794'
      }
    }
  });
}
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
