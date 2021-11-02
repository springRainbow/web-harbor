<template>
  <div>
    <common-header></common-header>
    <div class="apply">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <span class="apply-bg" v-if="$route.name == 'TenantList'"></span>
  </div>
</template>
<script>
export default {
  name: 'apply',
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.apply {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 84px;
  bottom: 0;
  height: calc(100% - 96px);
}
.apply-bg {
  display: block;
  position: fixed;
  width: 480px;
  height: 310px;
  bottom: 0;
  right: 0;
  // background: url('~@/assets/login-bg.png') no-repeat right bottom;
  // background-size: 480px;
  z-index: -1;
}
</style>
<style>
@media screen and (min-width: 1440px) {
  .apply {
    width: 1440px !important;
  }
}
@media screen and (max-width: 1440px) and (min-width: 1180px) {
  .apply {
    width: 1180px !important;
  }
}
</style>
