<template>
  <div class="login">
    <div class="login-header">
      <img class="login-logo" src="~@/assets/login-logo.png" alt="logo" />
    </div>
    <div class="login-main">
      <p class="login-main_tit">欢迎使用轻舟号</p>
      <div class="login-main_box g-clearfix">
        <div class="login-main_img">
          <!-- <img src="~@/assets/login-img.png" alt="login-img" /> -->
          <div class="circle1 circle"></div>
          <div class="circle2 circle"></div>
          <div class="circle3 circle"></div>
          <div class="circle4 circle"></div>
          <div class="fixed">
            <div class="text text1">管理</div>
            <div class="block block1">
              <p>内容生产</p>
              <p>Content production</p>
            </div>
            <div class="text text2">设置</div>
            <div class="block block2">
              <p>营销转化</p>
              <p>Marketing conversion</p>
            </div>
            <div class="text text3">账号</div>
            <div class="block block3">
              <p>专业服务</p>
              <p>Professional service</p>
            </div>
            <div class="text text4">资料</div>
          </div>
        </div>
        <div class="login-main_opt">
          <h3>登录/注册</h3>
          <div class="login-main_input">
            <p class="tit">手机号</p>
            <el-input
              v-model.trim="phone"
              class="input-with-select"
              :class="phoneFocus ? 'input-focus' : ''"
              placeholder="输入手机号"
              @focus="phoneFocus = true"
              @blur="phoneFocus = false"
            >
              <el-select v-model="phone_code" @visible-change="getAllPhoneCodeList" slot="prepend">
                <el-option
                  v-for="(item, index) in phoneCodeList"
                  :key="`code${index}`"
                  :label="`+${item.code}（${item.national}）`"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-input>
            <p class="tit">验证码</p>
            <el-input
              class="input-with-select"
              :class="codeFocus ? 'input-focus' : ''"
              v-model="sms_code"
              @input="isNumber"
              @keydown.enter.native="loginSms"
              placeholder="验证码"
              @focus="codeFocus = true"
              @blur="codeFocus = false"
            >
              <template slot="append">
                <span @click="sendCode" :class="{ disabled: countDownDisabled || phone == '' }">{{
                  countDownText
                }}</span>
              </template>
            </el-input>
          </div>
          <div id="captcha" style="margin: -16px 0 10px 0"></div>
          <el-button class="login-btn" :loading="buttonLoading" type="primary" @click="loginSms">注册/登录</el-button>
          <div class="login-tips">
            <p>新号码将自动进入注册流程</p>
            <p>登录即代表你已阅读并同意<span @click="goAgree">《用户隐私条款》</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loginMixin } from './_mixin';
export default {
  name: 'login',
  mixins: [loginMixin],
  data() {
    return {
      phoneFocus: false,
      codeFocus: false
    };
  },
  created() {
    sessionStorage.removeItem('clickAgree');
  },
  methods: {
    goAgree() {
      this.$router.push({
        name: 'loginAgreement'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  background: #f8fcfe;
  @include full-screen;
  overflow-y: auto;
  .login-tips {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 20px;
    line-height: 22px;
    p {
      position: relative;
      padding-left: 20px;
      &::before {
        content: '';
        position: absolute;
        width: 12px;
        height: 13px;
        background: url('~@/assets/icon-dot.png') no-repeat;
        background-size: 12px;
        left: 0;
        top: 3px;
      }
      span {
        cursor: pointer;
        &:hover {
          color: $mainColor;
        }
      }
    }
  }
  &-logo {
    width: 118px;
    height: 25px;
    position: absolute;
    left: 40px;
    top: 24px;
  }
  &-main {
    position: absolute;
    width: 1180px;
    right: 0;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 9;
    top: 15%;
    min-height: 800px;
    &_tit {
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      line-height: 72px;
      letter-spacing: 1px;
      font-size: 48px;
    }
    &_img {
      position: relative;
      perspective: 10000px;
      perspective-origin: center;
      transform-style: preserve-3d;
      transform-origin: 50% 50% 0;

      width: 590px;
      height: 490px;
      float: left;
      margin-right: 68px;
      .fixed {
        .text {
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0px 6px 11px 2px rgba(179, 188, 212, 0.12);
          opacity: 0.88;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 12px;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.6);
        }
        .block {
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          border-radius: 50%;
        }
        .text1 {
          margin-left: 144px;
          margin-top: 36px;

          width: 46px;
          height: 46px;
        }
        .text2 {
          margin-left: 520px;
          margin-top: -180px;

          width: 62px;
          height: 62px;
        }
        .text3 {
          margin-top: -16px;
          margin-left: 34px;

          width: 62px;
          height: 62px;
        }
        .text4 {
          margin-top: 3px;
          margin-left: 384px;

          width: 60px;
          height: 60px;
        }
        .block1 {
          margin-left: 215px;
          margin-top: -82px;

          transform: translateZ(2px);
          width: 280px;
          height: 280px;
          background: #2bd5eb;
          box-shadow: 0px 10px 34px -8px rgba(117, 189, 221, 0.8) inset, 0px 3px 6px 0px rgba(255, 255, 255, 0.4) inset;
          p {
            font-size: 36px;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: #ffffff;
          }
          p:last-child {
            font-size: 15px;
            font-family: SourceHanSansCN-Normal, SourceHanSansCN;
          }
        }
        .block2 {
          margin-left: 65px;
          margin-top: -62px;

          transform: translateZ(1px);
          width: 217px;
          height: 217px;
          background: #0d93ff;
          box-shadow: 0px 14px 32px -8px rgba(91, 162, 237, 0.7) inset, 0px 1px 7px 0px rgba(255, 255, 255, 0.4) inset;
          p {
            font-size: 24px;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: #ffffff;
          }
          p:last-child {
            font-size: 12px;
            font-family: SourceHanSansCN-Normal, SourceHanSansCN;
            font-weight: 400;
            transform: scale(0.83);
          }
        }
        .block3 {
          margin-top: -129px;
          margin-left: 224px;

          transform: translateZ(0px);
          width: 139px;
          height: 139px;
          background: #ffc200;
          box-shadow: 0px 10px 25px -8px rgba(200, 176, 95, 0.5) inset, 0px 2px 6px 0px rgba(255, 255, 255, 0.4) inset;
          p {
            font-size: 20px;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: #ffffff;
          }
          p:last-child {
            font-size: 8px;
            font-family: SourceHanSansCN-Normal, SourceHanSansCN;
            font-weight: 400;
            color: #ffffff;
            transform: scale(0.67);
          }
        }
      }

      @mixin rotateBall($x, $y, $name: 'rotateBall', $delay: 0) {
        animation: #{$name}X 6s ease-in-out #{-3 - $delay}s infinite alternate,
          #{$name}Y 6s ease-in-out -#{$delay}s infinite alternate;
        @keyframes #{$name}X {
          0% {
            left: 0;
          }
          100% {
            left: 90%;
          }
        }
        @keyframes #{$name}Y {
          0% {
            top: 0;
          }
          100% {
            top: 90%;
          }
        }
      }
      .circle {
        position: absolute;
        border-radius: 50%;
        transform: translate(50%, -50%);
      }
      .circle1 {
        top: 33px;
        left: 65px;
        width: 29px;
        height: 29px;
        background: #f7cb80;
        @include rotateBall(470px, 220px, rotateBall1);
      }
      .circle2 {
        top: 122px;
        left: 0;
        width: 16px;
        height: 16px;
        background: #5fd8ec;
        @include rotateBall(380px, 220px, rotateBall2, 0.8);
      }
      .circle3 {
        top: 295px;
        left: 475px;

        width: 24px;
        height: 24px;
        background: #5ed6eb;
        @include rotateBall(-450px, -180px, rotateBall3, 5);
      }
      .circle4 {
        top: 407px;
        left: 288px;

        width: 10px;
        height: 10px;
        background: #ecc485;
        @include rotateBall(-200px, -400px, rotateBall4, 5.8);
      }
    }
    &_box {
      margin-top: 72px;
    }
    &_opt {
      width: 400px;
      height: 440px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      border: 1px solid #f1f1f1;
      float: left;
      box-sizing: border-box;
      padding: 40px 40px 0 40px;
      box-shadow: 0px 30px 68px 0px rgba(74, 115, 167, 0.08);
      h3 {
        font-size: 24px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.8);
        margin-bottom: 40px;
      }
      .tit {
        color: rgba(0, 0, 0, 0.4);
        line-height: 22px;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .input-with-select {
        margin-bottom: 25px;
        /deep/.el-input-group__prepend,
        /deep/.el-input-group__append {
          background-color: #fff;
          width: 80px;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          border-radius: 0;
          cursor: pointer;
        }
        /deep/.el-input-group__append {
          color: $mainColor;
          text-align: center;
          .disabled {
            color: rgba(0, 0, 0, 0.4);
            pointer-events: none;
            cursor: default;
          }
        }
        /deep/.el-input__inner {
          padding: 0 15px 0 0;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        }
        &.input-focus {
          /deep/.el-input-group__prepend,
          /deep/.el-input-group__append {
            border-color: $mainColor;
          }
        }
      }
    }
  }
  &-btn {
    width: 100%;
    height: 44px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 22px;
  }
}
</style>
