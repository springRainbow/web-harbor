<template>
  <div class="clue">
    <el-form ref="form" :model="form" inline>
      <el-form-item label="用户ID：" prop="passport_id">
        <el-input v-model="form.passport_id"></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="passport_name">
        <el-input v-model="form.passport_name"></el-input>
      </el-form-item>
      <el-form-item label="咨询方式：" prop="card_type">
        <el-select v-model="form.card_type" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option :label="item.name" :value="item.id" v-for="item in conf" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路径：" prop="obj_name">
        <el-input v-model="form.obj_name"></el-input>
      </el-form-item>
      <el-form-item label="路径id：" prop="news_uuid" v-show="false">
        <el-input v-model="form.news_uuid"></el-input>
      </el-form-item>
      <el-form-item label="首次咨询时间：" label-width="120px" prop="date">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm"
          end-placeholder="结束日期"
          style="width: 300px"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <qzTable ref="searchResultList" :options="gridOptions" :serviceInstanceScreen="serviceInstanceScreen"> </qzTable>
    <LogsList ref="loglist"></LogsList>
  </div>
</template>
<script>
import api from '../_api';
import LogsList from './LogsList';
export default {
  name: '',
  components: {
    LogsList
  },
  data() {
    return {
      form: {
        date: [],
        passport_id: '',
        passport_name: '',
        card_type: 0,
        obj_name: '',
        tenant_uuid: localStorage.getItem('HARBOR_ID'),
        news_uuid: ''
      },
      conf: [],
      gridOptions: {
        dataSource: {
          serviceInstance: api.getStatList,
          loadDataOnFirst: false
        },
        grid: {
          highlightCurrentRow: false,
          pagination: {
            background: true
          },
          operates: {
            list: [
              {
                type: 'text',
                label: '咨询日志',
                method: this.showLogs
              }
            ]
          },
          columns: [
            {
              prop: 'passport_id',
              label: '用户ID'
            },
            {
              prop: 'passport_name',
              label: '昵称'
            },
            {
              prop: 'created_at',
              label: '首次咨询时间',
              width: 160
            },
            {
              prop: 'card_name',
              label: '咨询方式'
            },
            {
              prop: 'obj_name',
              label: '路径'
            },
            {
              prop: 'consult_num',
              label: '咨询次数'
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.getClueConfig();
    if (this.$route.query.obj_name) {
      this.form.obj_name = this.$route.query.obj_name;
      this.form.news_uuid = this.$route.query.news_uuid;
    }
    this.$nextTick(() => {
      this.$refs.searchResultList.refresh();
    });
  },
  methods: {
    async getClueConfig() {
      const { result } = await api.getClueConfig();
      this.conf = result;
    },
    showLogs(key, item) {
      this.$refs.loglist.init(item.passport_id);
    },
    search() {
      this.$refs.searchResultList.refresh();
    },
    reset() {
      this.$refs.form.resetFields();
      this.$refs.searchResultList.refresh();
    }
  },
  computed: {
    serviceInstanceScreen() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (form.date && form.date.length) {
        form.start_date = form.date[0];
        form.end_date = form.date[1];
      }
      delete form.date;
      return form;
    }
  }
};
</script>
<style lang="scss" scpoed>
.clue {
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
}
</style>
