<template>
  <!-- /**
     * 模糊搜索机构
  */-->
  <el-select
    v-model.trim="val"
    filterable
    remote
    clearable
    v-bind="$attrs"
    reserve-keyword
    placeholder="搜索机构名"
    :remote-method="getTenantByDim"
    :loading="loading"
    @change="handleChange"
  >
    <el-option v-for="item in tenant_options" :key="item.name" :label="item.name" :value="item.uuid"></el-option>
  </el-select>
</template>
<script>
import api from '@/views/content/_api.js';
export default {
  name: 'tenantselect',
  components: {},
  data() {
    return {
      loading: false,
      val: '',
      tenant_options: []
    };
  },
  methods: {
    // 下拉选择
    handleChange(res) {
      if (!res) this.tenant_options = [];
      this.$emit('change-edit', res);
    },

    /**
     * 模糊搜索机构
     */

    async getTenantByDim(n) {
      if (n == ' ' || n.length < 1) {
        return;
      }
      let { result } = await api.getTenantByDim({
        name: n
      });
      this.tenant_options = result.data;
    }
  }
};
</script>
<style lang="scss" scpoed></style>
