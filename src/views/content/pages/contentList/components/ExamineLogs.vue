<template>
  <el-dialog title="" :visible.sync="show" width="750px" class="news-log">
    <p class="log">未过审原因详情</p>
    <el-table :data="logList">
      <el-table-column align="center" header-align="center" prop="type_name" label="内容类型"></el-table-column>
      <el-table-column align="center" header-align="center" prop="reason" label="违规原因"></el-table-column>
      <el-table-column align="center" header-align="center" label="具体原因">
        <template slot-scope="scope">
          <span v-if="scope.reason_type == 2">{{ scope.row.video_show_name }}</span>
          <span v-else>{{ scope.row.more_reason }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      logList: []
    };
  },
  components: {},
  props: {},
  created() {},
  methods: {
    init(list) {
      this.logList = list || [];
      this.show = true;
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
