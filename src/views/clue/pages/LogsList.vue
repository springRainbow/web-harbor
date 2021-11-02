<template>
  <div class="loglist">
    <el-dialog title="咨询日志" :visible.sync="dialogTableVisible" width="700px">
      <qzTable
        class="log-table"
        ref="logResultList"
        :options="gridOptions"
        :serviceInstanceScreen="serviceInstanceScreen"
      >
      </qzTable>
    </el-dialog>
  </div>
</template>
<script>
import api from '../_api';
export default {
  name: '',
  data() {
    return {
      dialogTableVisible: false,
      serviceInstanceScreen: {
        passport_id: '',
        tenant_uuid: localStorage.getItem('HARBOR_ID')
      },
      gridOptions: {
        dataSource: {
          serviceInstance: api.getUserListLogs,
          loadDataOnFirst: false
        },

        grid: {
          pagination: {
            background: true
          },
          operates: {
            list: []
          },
          columns: [
            {
              prop: 'created_at',
              label: '操作时间'
            },
            {
              prop: 'tenant_name',
              label: '轻舟号'
            },
            {
              prop: 'obj_name',
              label: '内容标题'
            }
          ]
        }
      }
    };
  },
  created() {},
  methods: {
    init(passport_id) {
      console.log(passport_id);
      this.dialogTableVisible = true;
      this.serviceInstanceScreen.passport_id = passport_id;

      this.$nextTick(() => {
        this.$refs.logResultList.refresh();
      });
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.log-table {
  padding: 0px 40px;
}
</style>
