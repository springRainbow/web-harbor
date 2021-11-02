<template>
  <el-dialog title="" :visible.sync="show" width="750px" class="news-log">
    <p class="log">日志</p>
    <el-table :data="logList" border style="width: 100%">
      <el-table-column align="center" header-align="center" label="操作人" width="180">
        <template slot-scope="scope">
          {{ scope.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" prop="created_at" label="操作时间" width="180">
      </el-table-column>
      <el-table-column align="center" header-align="center" prop="action" label="操作"> </el-table-column>
      <el-table-column label="备注" align="center" header-align="center">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import api from '../../../_api';
export default {
  data() {
    return {
      uuid: '',
      show: false,
      logList: []
    };
  },
  components: {},
  props: {},
  created() {},
  methods: {
    async getNewsLog(uuid) {
      this.uuid = uuid;
      this.show = true;
      let { result } = await api.getNewsLog(uuid);
      this.logList = result;
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.news-log {
  /deep/.el-dialog__body {
    padding: 14px 24px 46px;
  }
  /deep/.el-table th {
    background: rgba(247, 252, 253, 1);
  }
  .remark {
    font-size: 12px;
    color: rgba(38, 214, 221, 1);
    line-height: 22px;
  }
  .log {
    height: 26px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    line-height: 26px;
    text-align: center;
    margin-bottom: 16px;
  }
}
</style>
