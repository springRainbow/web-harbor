const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const XesOSSPlugin = require('@xes/webpack-xesoss-plugin');
// 引入资源的后缀
const suffix = {
  development: '.js',
  beta: '.js',
  production: '.min.js'
};
// 用户中心sdk
const passportSDK =
  process.env.NODE_ENV == 'development'
    ? 'https://test-ucres.100tal.com/libs/jssdk/passport.js?t=20210309'
    : ' https://ucres.100tal.com/libs/jssdk/passport@1.14.04/passport.js?t=20210309';
// cdn引入
const cdn = {
  css: [],
  js: [
    `${process.env.VUE_APP_PRFIEX}static.qz100.com/libs/vue/vue@2.6.12${suffix[process.env.NODE_ENV]}`,
    `${process.env.VUE_APP_PRFIEX}static.qz100.com/libs/vue-router/vue-router@3.3.4${suffix[process.env.NODE_ENV]}`,
    `${process.env.VUE_APP_PRFIEX}static.qz100.com/libs/vuex/vuex@3.5.1${suffix[process.env.NODE_ENV]}`,
    passportSDK
  ]
};
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  productionSourceMap: true,
  devServer: {
    host: 'test-vue.qz100.com',
    port: 8080,
    https: true //阿里云的oss上传，测试环境没有网校的证书，只能是http
  },
  configureWebpack: {
    externals: {
      vue: 'window.Vue',
      'vue-router': 'window.VueRouter',
      vuex: 'window.Vuex',
      TAL_UC: 'window.TAL_UC'
    }
  },
  chainWebpack: (config) => {
    // 挂载全局的scss变量
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) => addStyleResource(config.module.rule('scss').oneOf(type)));
    // htmlWebpackPlugin 挂载到cdn
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn;
      return args;
    });

    config.plugin('filemanager-webpack-plugin').use(FileManagerPlugin, [
      {
        events: {
          onEnd: {
            mkdir: ['dist/map'],
            copy: [{ source: 'dist/js/*.map', destination: 'dist/map' }],
            delete: ['dist/js/*.map']
          }
        }
      }
    ]);

    config.plugin('webpack-xesoss-plugin').use(XesOSSPlugin, [
      {
        uploadFile: 'dist/map'
      }
    ]);
  }
};
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/scss/*.scss') //  引入共享全局变量
      ]
    });
}
