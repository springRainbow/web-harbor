<template>
  <div class="setting">
    setting 业务模块入口在这里
    <router-view></router-view>
  </div>
</template>
<script>
import api from './_api';
export default {
  name: 'setting',
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped></style>
