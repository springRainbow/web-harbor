<!--
*
* 学校单选
* 下拉还是级联取决于当前机构有没有选默认的学校
*
-->
<template>
  <div style="display: inline">
    <el-select
      :multiple="false"
      class="tags-school-major"
      v-model="school_id"
      v-if="schools.length"
      placeholder="请选择"
    >
      <el-option :label="item.school_name" :value="item.id" v-for="item in schools" :key="item.id"></el-option>
    </el-select>
    <el-cascader
      placeholder="请选择"
      v-model="school_id"
      v-if="!schools.length"
      :options="allSchools"
      :props="prop_school"
      clearable
      :show-all-levels="false"
      popper-class="school-cascader"
      class="tags-school-major"
    >
      <template slot-scope="{ node, data }">
        <span>{{ data.region_name }}</span>
        <span v-if="node.level == 2">{{ data.school_name }}</span>
      </template>
    </el-cascader>
  </div>
</template>
<script>
export default {
  data() {
    return {
      school_id: '',
      prop_school: {
        value: 'id',
        label: 'school_name',
        multiple: false,
        emitPath: false,
        checkStrictly: false,
        children: 'school'
      }
    };
  },
  components: {},
  props: {
    allSchools: Array,
    schools: Array,
    schoolId: Array
  },
  created() {
    this.school_id = this.schoolId[0];
  },
  computed: {},
  methods: {
    getSchoolId() {
      if (!this.school_id) return [];
      return [this.school_id];
    },
    setSchoolId(id) {
      this.school_id = id;
    }
  },
  watch: {
    schoolId(val) {
      this.school_id = val[0];
    }
  }
};
</script>
<style lang="scss" scoped>
.tags-select,
.tags-style {
  width: 116px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin-right: 12px;
}
.tags-select.active {
  border: 1px solid rgba(35, 213, 221, 1);
  /deep/.el-input__inner {
    color: rgba(35, 213, 221, 1);
    background: rgba(234, 249, 251, 1);
  }
  /deep/.el-input__suffix .el-input__suffix-inner .el-select__caret {
    color: rgba(35, 213, 221, 1);
  }
}
.tags-school-major {
  margin-bottom: 10px;
  width: 100%;
}
.tags-style {
  top: 2px;
  position: relative;
  padding: 8px 26px;
  &.active {
    border: 1px solid rgba(35, 213, 221, 1);
    color: rgba(35, 213, 221, 1);
    background: rgba(234, 249, 251, 1);
  }
}
</style>
