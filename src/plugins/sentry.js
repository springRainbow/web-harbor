import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import VueCookie from 'vue-cookie';

let setExtra = null,
  sentry = null;

if (process.env.NODE_ENV == 'development') {
  setExtra = (data) => {
    console.log(data);
  };
} else {
  Sentry.init({
    dsn: 'https://5aa0e91e9077452291e3bcc3d0e7bea5@sentry.yeeaoo.com/59',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  });

  setExtra = (data) => {
    Sentry.withScope(function (scope) {
      scope.setTag('Error', 'Data Error');
      scope.setLevel('warning');
      scope.setExtra('data', data || {});
      // 设置用户信息：
      scope.setUser({ Authorization: 'Bearer ' + VueCookie.get('authkey') });
      Sentry.captureMessage('errData');
    });
  };
  sentry = Sentry;
}

export { setExtra, sentry };
