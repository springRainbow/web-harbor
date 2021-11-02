import Vue from 'vue';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  preLoad: 1,
  attempt: 2,
  filter: {
    webp(listener, options) {
      // 判断是否支持 webp格式
      if (!options.supportWebp) return;
      const isCode = /code.kmf.com/; // 判断是否为code服务器资源
      const isOss = /x-oss-process=image/; // 判断是否已经转为了oss，防止swiper复制出错
      if (!isCode.test(listener.src) && !isOss.test(listener.src)) {
        listener.src += '?x-oss-process=image/format,webp';
      }
    }
  }
});
