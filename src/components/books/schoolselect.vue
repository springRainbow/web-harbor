<template>
  <!--     /**
     * 模糊搜索院校
  */-->
  <el-select
    v-model.trim="val"
    filterable
    remote
    clearable
    v-bind="$attrs"
    reserve-keyword
    :multiple-limit="limit"
    placeholder="搜索院校"
    :remote-method="getSchoolByDim"
    :loading="loading"
    @change="handleChange"
  >
    <el-option
      v-for="item in school_options"
      :key="item.id"
      :label="item.school_name"
      :value="item.id.toString()"
    ></el-option>
  </el-select>
</template>
<script>
import api from '@/views/content/_api.js';
export default {
  name: 'schoolselect',
  components: {},
  props: {
    limit: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      val: [],
      school_options: []
    };
  },
  methods: {
    // 下拉选择
    handleChange(res) {
      if (!res) this.school_options = [];
      this.$emit('change-edit', res);
    },
    /**
     * 模糊搜索院校
     */
    async getSchoolByDim(n) {
      if (n == ' ' || n.length < 1) {
        return;
      }
      let { result } = await api.getSchoolByDim({
        school_name: n
      });
      this.school_options = result;
    }
  }
};
</script>
<style lang="scss" scpoed></style>
