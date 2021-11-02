const api = require('./_api').default;
const { isMobileDevice } = require('@/utils/tool.js');
const { mapActions } = require('vuex');
exports.loginMixin = {
  data() {
    return {
      phone: '',
      phone_code: '86',
      sms_code: '',
      countDownText: '获取验证码',
      countDownDisabled: false,
      buttonLoading: false,
      deviceId: '', // 设备id
      phoneCodeList: [
        {
          code: '86',
          mark: '常用',
          national: '中国'
        }
      ]
    };
  },
  created() {
    this.getDeviceInfo();
    this.rankConfig();
    this.configNVC();
  },
  methods: {
    ...mapActions('user', ['updateUserInfo']),
    rankConfig() {
      TAL_UC.rankConfig({
        'client-id': isMobileDevice() ? 391201 : 391101, // client-id由平台发放权限码，接入之前向平台申请
        env: process.env.NODE_ENV == 'production' ? 'production' : 'sandbox'
      });
    },

    // 获取设备信息
    getDeviceInfo() {
      let _this = this;
      TAL_UC.getDeviceInfo({
        data: {},
        success: function (res) {
          if (res.errcode == 0) {
            _this.deviceId = res.data['device-id'];
          }
        },
        fail: function (error) {
          console.log(error);
        }
      });
    },
    // 初始化滑块验证
    configNVC(isH5) {
      TAL_UC.configNVC({
        renderToEle: '#captcha',
        isH5: isH5,
        onloadCallback: () => {
          console.log('滑块配置完成');
        },
        failCallback: () => {
          console.log('滑块配置失败');
        }
      });
    },
    // 滑块验证
    showSlide(name, data) {
      let param = {
        slideCallback: name,
        slideParams: data,
        failCallback: (error) => {
          this.buttonLoading = false;
          this.$message.error(error.message);
        }
      };
      // 展示滑块
      TAL_UC.showSlide(param);
    },
    // 获取手机区号
    getAllPhoneCodeList(show) {
      if (show && this.phoneCodeList.length == 1) {
        TAL_UC.getAllPhoneCodeList({
          success: (res) => {
            res.data.list.forEach((el) => {
              el['text'] = `+${el.code}${el.national}`;
            });
            this.phoneCodeList = res.data.list;
          }
        });
      }
    },
    // 发送验证码
    sendCode() {
      let sec = 60;
      this.countDownDisabled = true;
      this.countDownText = '60s';
      this.sendSMSCodeLogin(); // 获取手机验证码
      let timer = setInterval(() => {
        this.countDownText = `${--sec}s`;
        if (sec == 0) {
          clearInterval(timer);
          this.countDownText = '重新获取';
          this.countDownDisabled = false;
        }
      }, 1000);
    },
    // 获取手机验证码 -- 登录
    sendSMSCodeLogin() {
      this.errcode = -1;
      let params = {
        data: {
          verify_type: 1,
          phone_code: this.phone_code,
          phone: this.phone
        },
        success: (res) => {
          this.errcode = res.errcode;
          if (res.errcode == 11021) {
            // 展示滑块
            this.showSlide('sendSMSCodeLogin', params);
            return;
          } else if (res.errcode == 0) {
            this.$message.success('验证码已发送，请注意查收。');
          } else {
            this.$message.error(res.errmsg);
            this.buttonLoading = false;
          }
        },
        fail: (error) => {
          console.log(error);
          this.buttonLoading = false;
          // this.errorMessage(error)
        }
      };
      TAL_UC.sendSMSCodeLogin(params);
    },
    // 手机号验证码登录
    loginSms() {
      this.buttonLoading = true;
      let params = {
        data: {
          phone: this.phone,
          phone_code: this.phone_code,
          sms_code: this.sms_code
        },
        success: (res) => {
          console.log(res);
          if (res.errcode == 11021) {
            // 展示滑块
            this.showSlide('loginSms', params);
            return;
          } else if (res.errcode == 0) {
            // 换取token
            this.getToken(res.data.code, 'code');
          } else {
            this.$message.error(res.errmsg);
            this.buttonLoading = false;
          }
        },
        fail: (error) => {
          console.log(error);
          this.buttonLoading = false;
        }
      };
      TAL_UC.loginSms(params);
    },
    // 换取登录token
    async getToken(code) {
      const { result, status, message } = await this.$http.post(
        api.getTalToken,
        {
          code: code
        },
        {
          headers: {
            'K-Client-Id': isMobileDevice() ? 391201 : 391101,
            'K-Device-Id': this.deviceId
          }
        }
      );
      if (status == 200) {
        this.setCookie(result.tal_token);
        this.$message.success('欢迎来到轻舟号平台~');
        this.buttonLoading = false;
        this.updateUserInfo(result.user);
        if (this.$route.query.backurl) {
          window.location.href = this.$route.query.backurl;
        } else {
          this.$router.push({
            name: 'apply'
          });
        }
      } else {
        this.$message.error(message);
        this.buttonLoading = false;
      }
    },
    // 设置cookie
    async setCookie(auth) {
      this.$cookie.set('authkey', auth, {
        expires: 31,
        domain: '.qz100.com'
      });
    },
    isNumber(value) {
      let reg = /^\d{1,}$/;
      if (!reg.test(value)) {
        this.sms_code = '';
      }
    }
  }
};
