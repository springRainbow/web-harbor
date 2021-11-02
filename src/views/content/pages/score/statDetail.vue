<template>
  <div class="score_outer">
    <div style="overflow: hidden; margin-bottom: 5px">
      <img src="~@/assets/content/goback.png" @click="$router.go(-1)" class="goback" />
      <p class="title_detail">{{ $route.query.id + '届报录比详情' }}</p>
    </div>
    <div class="seache_outer">
      <!-- <el-select v-model="sec_state" placeholder="状态">
        <el-option value label>请选择</el-option>
        <el-option value="1" label="已补充"></el-option>
        <el-option value="2" label="未补充"></el-option>
        <el-option value="3" label="被占领"></el-option>
      </el-select>-->

      <school-select v-on:change-edit="schoolChange"></school-select>
      <major-select :include_second="0" :include_third="1" v-on:change-edit="majorChange"></major-select>

      <el-button
        type="primary"
        @click="
          currentPage = 1;
          getStatYearList();
        "
        size="mini"
        >查询</el-button
      >
      <div class="fr">
        <img src="~@/assets/content/icon_upload.png" class="icon_upload" alt />
        <el-link type="primary" @click="dialogVisible = true">批量上传</el-link>
      </div>
    </div>
    <!-- 表单区域 -->
    <el-table :data="scoreList" v-loading="tableLoading" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="filled_status" label="状态">
        <template slot-scope="scope"
          ><span v-if="scope.row.filled_status == 2" style="color: #999">被占领</span>
          <span v-else>{{ scope.row.filled_status | stateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="school_code" label="院校编码"></el-table-column>
      <el-table-column prop="school_name" label="院校名称"></el-table-column>
      <el-table-column prop="major_code" label="专业代码"></el-table-column>
      <el-table-column prop="major_name" label="专业名称"></el-table-column>
      <el-table-column prop="enroll_year" label="考研届"></el-table-column>
      <el-table-column prop="enroll_status" label="招生状态">
        <template slot-scope="scope">{{ scope.row.enroll_status | enroll_statusFilter }}</template>
      </el-table-column>
      <el-table-column prop="recruit_num" label="招生人数">
        <template slot-scope="scope">{{ scope.row.recruit_num | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="apply_num" label="报名人数">
        <template slot-scope="scope">{{ scope.row.apply_num | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="enroll_num" label="录取人数">
        <template slot-scope="scope">{{ scope.row.enroll_num | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="enroll_num" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-link v-if="scope.row.filled_status == 2" disabled>编辑</el-link>
          <el-link
            type="primary"
            v-else
            @click="
              edit.older = JSON.parse(JSON.stringify(scope.row));
              edit.older.recruit_num = edit.older.recruit_num == 0 ? '' : edit.older.recruit_num;
              edit.older.apply_num = edit.older.apply_num == 0 ? '' : edit.older.apply_num;
              edit.older.enroll_num = edit.older.enroll_num == 0 ? '' : edit.older.enroll_num;
              edit.older.enroll_status = 1;
              edit.dialogState = true;
            "
            >编辑</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="paination_wrap">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, pager, next,total"
        :page-sizes="[50, 100, 200]"
        :page-size="20"
        :total="listTotal"
        hide-on-single-page
      ></el-pagination>
    </div>

    <uploadex
      :year="this.$route.query.id"
      :dialogVisible="dialogVisible"
      loadtype="2"
      ref="upload"
      v-on:export-cli="getExport"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
    ></uploadex>

    <el-drawer
      :center="true"
      title="编辑报录比"
      :size="560"
      class="score_dialog"
      :show-close="false"
      :visible.sync="edit.dialogState"
    >
      <el-form :model="edit" style="width: 100%">
        <el-form-item label="学校名称：" :label-width="formLabelWidth">
          <el-input v-model="edit.older.school_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业名称：" :label-width="formLabelWidth">
          <el-input v-model="edit.older.major_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="届数：" :label-width="formLabelWidth">
          <el-select v-model="edit.older.enroll_year" disabled>
            <el-option :value="edit.older.enroll_year">{{ edit.older.enroll_year }}届</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-select v-model="edit.older.enroll_status">
            <el-option :value="1" label="招生">招生</el-option>
            <el-option :value="2" label="不招生">不招生</el-option>
          </el-select>
        </el-form-item>
        <template v-if="edit.older.enroll_status == 1">
          <el-form-item label="招生人数：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.recruit_num"
              :maxlength="4"
              type="number"
              :min="0"
              @keydown.native="rejectDoc"
              placeholder="请填写招生人数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="报名人数：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.apply_num"
              :maxlength="4"
              type="number"
              :min="0"
              @keydown.native="rejectDoc"
              placeholder="请填写报名人数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="录取人数：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.enroll_num"
              @keydown.native="rejectDoc"
              :maxlength="4"
              :min="0"
              type="number"
              placeholder="请填写录取人数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="demo-drawer__footer" style="margin: 40px">
        <el-button size="mini" @click="edit.dialogState = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveStat">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import api from '../../_api';
import { download } from '@/utils/download';
import uploadex from '@/components/books/uploadex.vue';
import majorSelect from '@/components/books/majorselect.vue';
import schoolSelect from '@/components/books/schoolselect.vue';
export default {
  name: 'statdetail',
  data() {
    return {
      sec_schoolName: '', //检索院校名称
      sec_majorName: '', //检索专业名称
      sec_state: '', //检索状态条件
      formLabelWidth: '130px',
      scoreList: [], //分数线列表
      currentPage: 1,
      pageSize: 20,
      listTotal: 0,
      edit: {
        dialogState: false,
        older: {} //编辑的当前数据备份
      },
      lineErr: '', //分数线错误信息
      tableLoading: false,
      school_options: '', //院校数据源
      major_options: '', //专业数据源
      loading: false,
      dialogVisible: false
    };
  },
  created() {
    this.getStatYearList();
  },
  filters: {
    stateFilter(val) {
      switch (val) {
        case 1:
          return '已补充';
          break;
        case 2:
          return '被占领';
          break;
        case 3:
          return '未补充';
          break;
      }
    },
    enroll_statusFilter(val) {
      switch (val) {
        case 0:
          return '--';
          break;
        case 1:
          return '招生';
          break;
        case 2:
          return '不招生';
          break;
      }
    },
    moveZeroFilter(val) {
      switch (val) {
        case 0:
          return '--';
          break;
        case '':
          return '--';
          break;
        default:
          return val;
      }
    }
  },
  methods: {
    /**
     * 获取指定年份分数线列表
     */
    async getStatYearList() {
      let n = {
        filled_status: this.sec_state,
        school_id: this.sec_schoolName,
        major_id: this.sec_majorName,
        year: this.$route.query.id,
        page: this.currentPage,
        per_page: this.pageSize,
        tenant_id: window.localStorage.getItem('HARBOR_ID')
      };
      this.tableLoading = true;
      let { result } = await api.getStatYearList(n);
      this.tableLoading = false;
      this.scoreList = result.data;
      this.listTotal = result.total;
    },
    /**
     * 专业选择
     */
    majorChange(res) {
      this.sec_majorName = res;
    },
    /**
     * 院校选择
     */
    schoolChange(res) {
      this.sec_schoolName = res;
    },
    /**
     * 保存分数线
     */
    async saveStat() {
      if (this.edit.older.enroll_status == 1) {
        if (this.edit.older.apply_num == '' && this.edit.older.enroll_num == '' && this.edit.older.recruit_num == '') {
          this.$message.warning('数据不能为空');
          return;
        }
      }
      //保存格式合规转义
      this.edit.older.apply_num = this.edit.older.apply_num == '' ? 0 : this.edit.older.apply_num;
      this.edit.older.enroll_num = this.edit.older.enroll_num == '' ? 0 : this.edit.older.enroll_num;
      this.edit.older.recruit_num = this.edit.older.recruit_num == '' ? 0 : this.edit.older.recruit_num;

      this.edit.older.enroll_id = this.edit.older.id;
      this.edit.older.tenant_id = window.localStorage.getItem('HARBOR_ID');
      let { message, result, status } = await api.saveStat(this.edit.older);
      if (status == 200) {
        this.$message.success('操作成功');
        this.getStatYearList();
        this.edit.dialogState = false;
      } else {
        this.$message.error(message);
      }
    },
    /**
     * 阻止小数点输入
     */
    rejectDoc(e) {
      if (e.keyCode == 190) {
        return;
      }
    },
    /**
     * 触发分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getStatYearList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getStatYearList();
    },
    async getExport(n) {
      let res = await api.getExport({
        year: n
      });
      this.$refs.upload.isloading = false;
      download(res, '报录比数据明细');
    }
  },
  components: {
    uploadex,
    majorSelect,
    schoolSelect
  }
};
</script>
<style lang="scss" scpoed>
.score_outer {
  padding: 30px;
  box-sizing: border-box;
  background: white;
}
.seache_outer {
  margin: 25px 0;
  .el-select,
  input {
    margin-right: 10px;
  }
}
.icon_upload {
  width: 20px;
  position: relative;
  top: 5px;
  margin: 0 5px 0 0;
}
.paination_wrap {
  margin-top: 30px;
  text-align: center;
}
.paination_wrap .el-pager .number.active {
  background: white;
  color: #15cfdc;
}
.score_dialog {
  .el-input,
  .el-select {
    width: 300px;
  }
}
input[type='number'] {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
}
.score_outer .el-drawer {
  overflow: scroll;
}
.score_dialog .el-drawer__header {
  font-weight: bold;
}
.title_detail {
  float: left;
  color: rgba(0, 0, 0, 0.6);
  font-size: 20px;
  margin-left: 5px;
  margin-top: -2px;
}
.score_outer .el-link--inner {
  line-height: 1.3;
}
.goback {
  width: 24px;
  height: 24px;
  float: left;
  cursor: pointer;
}
</style>
