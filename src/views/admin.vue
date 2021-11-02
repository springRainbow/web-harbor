<template>
  <div>
    <common-header></common-header>
    <div class="qz-main">
      <common-aside></common-aside>
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
  name: 'Admin',
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
<style lang="scss">
.qz-main {
  @include full-screen;
  margin: 0 auto;
  top: 84px;
  // height: calc(100% - 84px);
  display: flex;
  min-height: 900px;
  &_view {
    margin-left: 20px;
    width: calc(100% - 260px);
    min-width: 980px;
    background: rgba(255, 255, 255, 1);
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
  }
}
</style>
<style>
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
</style>
