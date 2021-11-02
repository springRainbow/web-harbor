<!--
*
* 专业多选
* 下拉还是级联取决于当前机构有没有选默认的专业
*
-->
<template>
  <div style="display: inline">
    <el-select class="tags-school-major" v-model="major_id" v-if="majors.length" placeholder="请选择" :multiple="true">
      <el-option :label="item.major_name" :value="item.id" v-for="item in majors" :key="item.id"></el-option>
    </el-select>
    <el-cascader
      class="tags-school-major"
      popper-class="majors-cascader"
      v-model="major_id"
      v-else
      :props="prop_major"
      clearable
      :show-all-levels="false"
      :placeholder="mPlaceholder || '请选择'"
    ></el-cascader>
  </div>
</template>
<script>
import api from '../../../../_api';

let getMajors = async function (_data) {
  let res = await api.getCompMajors(_data);
  if (res.status == 200) {
    return res.result;
  }
};
export default {
  data() {
    return {
      major_id: [],
      prop_major: {
        value: 'id',
        label: 'major_name',
        emitPath: false,
        lazy: true,
        multiple: true,
        checkStrictly: false,
        lazyLoad(node, resolve) {
          let _data = {
            parent: 0,
            level: node.level + 1,
            _s: new Date().getTime()
          };
          if (node.level > 0) {
            _data.parent = node.data.id;
          }

          if (node.level <= 3) {
            getMajors(_data).then((data) => {
              if (node.level == 3) {
                data.forEach((item) => {
                  item.leaf = true;
                });
              }
              resolve(data);
            });
          } else {
            resolve();
          }
        }
      }
    };
  },
  components: {},
  props: {
    majors: Array,
    majorId: Array,
    majorNameList: Array
  },
  computed: {
    mPlaceholder() {
      let arr = this.majorNameList.map((item) => {
        return item.major_name;
      });
      return arr.join('，');
    }
  },
  created() {
    this.major_id = this.majorId;
  },
  methods: {
    getMajorId() {
      return this.major_id;
    },
    setMajorId(id) {
      this.major_id = id;
    }
  },
  watch: {
    majorId(newVal) {
      this.major_id = newVal;
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
  width: 100%;
  margin-bottom: 10px;
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
