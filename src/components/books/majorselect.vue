<template>
  <!--     /**
     * 模糊搜索专业
  */-->
  <el-select
    v-model="val"
    filterable
    remote
    clearable
    reserve-keyword
    :multiple-limit="limit"
    v-bind="$attrs"
    placeholder="搜索专业"
    :remote-method="getMajorsByDim"
    :loading="loading"
    @change="handleChange"
  >
    <el-option v-for="item in major_options" :key="item.id" :label="item.major_name" :value="item.id">
      {{ item.major_code + ' ' + item.major_name }}
    </el-option>
  </el-select>
</template>
<script>
import api from '@/views/content/_api.js';
export default {
  name: 'majorselect',
  components: {},
  props: {
    limit: {
      type: [String, Number],
      default: 0
    },
    include_second: {
      type: [String, Number],
      default: 1
    },
    include_third: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      loading: false,
      val: [],
      major_options: []
    };
  },
  methods: {
    // 下拉选择
    handleChange(res) {
      if (!res) this.major_options = [];
      this.$emit('change-edit', res);
    },
    /**
     * 模糊搜索专业
     */
    async getMajorsByDim(n) {
      if (n == ' ' || n.length < 1) {
        return;
      }
      let { result } = await api.getMajorsByDim({
        include_second: this.include_second,
        include_third: this.include_third,
        major_name: n
      });
      this.major_options = result;
    }
  }
};
</script>
<style lang="scss" scpoed></style>
