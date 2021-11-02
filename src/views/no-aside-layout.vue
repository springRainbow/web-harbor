<template>
  <div>
    <div class="no-aside-header">
      <div class="no-aside-header_layout">
        <img class="no-aside-header_logo" src="~@/assets/logo@2x.png" alt="logo" />
      </div>
    </div>
    <div class="qz-main">
      <div class="qz-main_view">
        <vue-scroll :style="{ height: heightRoute.indexOf(this.$route.path) > -1 ? '' : `${clientHeight - 100}px` }">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'NoAside',
  data() {
    return {
      heightRoute: ['/setting/info']
    };
  },
  created() {
    sessionStorage.removeItem('clickAgree');
  },
  computed: {
    ...mapState({
      clientHeight: (state) => state.common.clientHeight
    })
  }
};
</script>
<style lang="scss" scoped>
.qz-main {
  @include full-screen;
  margin: 0 auto;
  top: 84px;
  // height: calc(100% - 84px);
  display: flex;
  min-height: 900px;
  &_view {
    margin-left: 20px;
    margin-right: 20px;
    width: calc(100%);
    min-width: 980px;
    background: rgba(255, 255, 255, 1);
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
  }
}
.no-aside-header {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
  position: fixed;
  z-index: 9;
  &_layout {
    width: 100%;
    height: 64px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 0 12px;
  }
  &_logo {
    width: 118px;
    height: 25px;
  }
}
</style>
<style scoped>
@media screen and (min-width: 1440px) {
  .qz-main {
    width: 1425px;
  }
}
@media screen and (max-width: 1440px) and (min-width: 1180px) {
  .qz-main {
    min-width: 1180px;
  }
}
@media screen and (min-width: 1440px) {
  .no-aside-header_layout {
    width: 1440px !important;
  }
}
@media screen and (max-width: 1440px) and (min-width: 1180px) {
  .no-aside-header_layout {
    width: 100% !important;
    min-width: 1180px !important;
  }
}
</style>
