<template>
  <div class="focuslist">
    <p class="focus_title">关注用户（{{ total }}）</p>
    <el-form ref="form" :model="form" inline @submit.native.prevent>
      <el-form-item label="昵称：" prop="user_name">
        <el-input v-model="form.user_name" placeholder="请输入用户昵称搜索" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <qzTable ref="searchResultList" :options="gridOptions" :serviceInstanceScreen="form" @data-change="dataChange">
    </qzTable>
    <div class="no-content-aera" v-if="!total && !form.user_name">
      <img class="no-content-image" src="~@/assets/bg-no-content.png" />
      <p class="no-content">还没有关注用户</p>
    </div>
  </div>
</template>
<script>
import api from '../../_api';
export default {
  name: '',
  components: {},
  data() {
    return {
      total: 0,
      form: {
        user_name: ''
      },
      conf: [],
      gridOptions: {
        dataSource: {
          serviceInstance: api.getFocusList
        },
        grid: {
          highlightCurrentRow: false,
          pagination: {
            background: true,
            pageSize: 20
          },
          operates: {
            list: []
          },
          columns: [
            {
              // prop: 'passport_name',
              label: '昵称',
              formatter: (row, column, cellValue) => {
                return `<span class='cover-span-a'>
                                            <img class="cover-image" src='${row.user.avatar_url}' />
                                        </span>
                                        <span class="nickname">${row.user.nickname}</span>`;
              }
            },
            {
              label: '关注日期',
              width: 130,
              formatter: (row, column, cellValue) => {
                return `${row.created_at.split(' ')[0].replace(/-/g, '.')}`;
              }
            }
          ]
        }
      }
    };
  },
  mounted() {},
  methods: {
    search() {
      this.$refs.searchResultList.refresh();
    },
    reset() {
      this.$refs.form.resetFields();
      this.$refs.searchResultList.refresh();
    },
    dataChange({ result }) {
      this.total = result.total;
    }
  },
  computed: {}
};
</script>
<style lang="scss" scpoed>
.focuslist {
  margin: 24px 32px;
  .el-form .el-input__inner {
    width: 240px;
    border-radius: 4px;
  }
  .el-table .el-button--small {
    padding: 0;
  }
  .el-form-item--small .el-form-item__label {
    line-height: 32px;
    color: rgba(0, 0, 0, 0.8);
  }
  .focus_title {
    height: 32px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 32px;
    margin-bottom: 20px;
  }
  .cover-span-a {
    display: inline-block;
  }
  .cover-image {
    width: 28px;
    height: 28px;
    vertical-align: middle;
    margin-right: 12px;
    border-radius: 14px;
  }
  .nickname {
  }
  .no-content-aera {
    position: relative;
    top: -100px;
    z-index: 100;
    background: #fff;
    text-align: center;
  }
  .no-content-image {
    position: relative;
    width: 394px;
    margin-top: 100px;
  }
  .no-content {
    height: 19px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 19px;
    text-align: center;
  }
}
</style>
