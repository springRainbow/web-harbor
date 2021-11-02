<template>
  <div id="app" class="rootapp">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: 'app',
  data() {
    return {};
  },
  created() {
    // console.log(a);
    this.getScrollHeight();
    window.onresize = () => {
      this.getScrollHeight();
    };
  },
  methods: {
    ...mapActions('common', ['updateClientHeight']),
    getScrollHeight() {
      let top;
      if (document.querySelector('.refuse-tips')) {
        top = 34;
        let timer = setInterval(() => {
          if (document.querySelector('.refuse-tips').offsetHeight != 34) {
            top = document.querySelector('.refuse-tips') && document.querySelector('.refuse-tips').offsetHeight;
            clearInterval(timer);
          }
        }, 300);
      } else {
        top = 0;
      }
      this.updateClientHeight(document.documentElement.clientHeight - top || document.body.clientHeight - top);
      // sessionStorage.setItem('HARBOR_HEIGHT', document.documentElement.clientHeight || document.body.clientHeight);
    }
  }
};
</script>
<style>
@import '~@/styles/css/reset.css';
.fade-enter-active,
.fade-leave-avtive {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<style lang="scss">
.rootapp {
  @include full-screen;
  overflow: hidden;
}
.qz-loading-gif {
  width: 120px;
  height: 120px;
  background: url('~@/assets/loading.gif') no-repeat;
  background-size: 120px;
  display: block;
  text-align: center;
  margin: 0 auto;
}
</style>
