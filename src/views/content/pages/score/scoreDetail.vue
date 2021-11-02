<template>
  <div class="score_outer">
    <!-- <el-page-header @back="$router.go(-1)" :title=""></el-page-header> -->
    <div style="overflow: hidden; margin-bottom: 5px">
      <img src="~@/assets/content/goback.png" @click="$router.go(-1)" class="goback" />
      <p class="title_detail">{{ this.$route.query.id + '届分数线详情' }}</p>
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
          getScoreYearList();
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
        <template slot-scope="scope">
          <span v-if="scope.row.filled_status == 2" style="color: #999">被占领</span>
          <span v-else>{{ scope.row.filled_status | stateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="school_id" label="院校编码"></el-table-column>
      <el-table-column prop="school_name" label="院校名称"></el-table-column>
      <el-table-column prop="major_id" label="专业代码"></el-table-column>
      <el-table-column prop="major_name" label="专业名称"></el-table-column>
      <el-table-column prop="faculty_name" label="学院名称"></el-table-column>
      <el-table-column prop="direction_name" label="研究方向"></el-table-column>
      <el-table-column prop="ky_year" label="届数"></el-table-column>
      <el-table-column prop="enroll_status" label="招生状态">
        <template slot-scope="scope">{{ scope.row.enroll_status | enroll_statusFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_entry" label="分数线">
        <template slot-scope="scope">{{ scope.row.score_entry | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_tutorial" label="小课">
        <template slot-scope="scope">{{ scope.row.score_tutorial | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_lecture" label="大课">
        <template slot-scope="scope">{{ scope.row.score_lecture | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_foreign_language" label="外语">
        <template slot-scope="scope">{{ scope.row.score_foreign_language | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_politics" label="政治">
        <template slot-scope="scope">{{ scope.row.score_politics | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_specialty_one" label="专业课一">
        <template slot-scope="scope">{{ scope.row.score_specialty_one | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="score_specialty_two" label="专业课二">
        <template slot-scope="scope">{{ scope.row.score_specialty_two | moveZeroFilter }}</template>
      </el-table-column>
      <el-table-column prop="not_fill_num" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-link v-if="scope.row.filled_status == 2" disabled>编辑</el-link>
          <el-link v-else type="primary" @click="editAdmin(scope.row)">编辑</el-link>
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
      loadtype="1"
      v-if="dialogVisible"
      ref="upload"
      :dialogVisible="dialogVisible"
      v-on:export-cli="getExport"
      :visible.sync="dialogVisible"
    ></uploadex>

    <el-drawer
      :center="true"
      title="编辑分数线"
      :size="560"
      class="score_dialog"
      :show-close="false"
      @close="handleCancel"
      :visible.sync="edit.dialogState"
    >
      <el-form :model="edit" style="width: 100%">
        <el-form-item label="学校名称：" :label-width="formLabelWidth">
          <el-input v-model="edit.older.school_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业名称：" :label-width="formLabelWidth">
          <el-input v-model="edit.older.major_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院名称：" :label-width="formLabelWidth">
          <el-input v-model="edit.older.faculty_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="研究方向：" :label-width="formLabelWidth">
          <el-input v-model="edit.older.direction_name" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="届数：" :label-width="formLabelWidth">
          <el-select v-model="edit.older.ky_year" disabled>
            <el-option :value="edit.older.ky_year">{{ edit.older.ky_year }}届</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-select v-model="edit.older.enroll_status">
            <el-option :value="1" label="招生">招生</el-option>
            <el-option :value="2" label="不招生">不招生</el-option>
          </el-select>
        </el-form-item>
        <template v-if="edit.older.enroll_status == 1">
          <el-form-item required :error="lineErr" label="分数线：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_entry"
              :maxlength="4"
              type="number"
              placeholder="请填写分数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="小课：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_tutorial"
              :maxlength="4"
              type="number"
              placeholder="请填写分数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="大课：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_lecture"
              :maxlength="4"
              type="number"
              placeholder="请填写分数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="外语：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_foreign_language"
              placeholder="请填写分数"
              :maxlength="4"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="政治：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_politics"
              :maxlength="4"
              type="number"
              placeholder="请填写分数"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="专业课一：" :maxlength="4" type="number" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_specialty_one"
              placeholder="请填写分数"
              :maxlength="4"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="专业课二：" :label-width="formLabelWidth">
            <el-input
              v-model="edit.older.score_specialty_two"
              placeholder="请填写分数"
              :maxlength="4"
              type="number"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="demo-drawer__footer" style="margin: 40px">
        <el-button plain size="mini" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveScore">确 定</el-button>
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
  name: 'scoredetail',
  data() {
    return {
      sec_schoolName: '', //检索院校名称
      sec_majorName: '', //检索专业名称
      sec_state: '',
      formLabelWidth: '100px',
      scoreList: [], //分数线列表
      currentPage: 1,
      pageSize: 20,
      listTotal: 0,
      edit: {
        dialogState: false,
        older: {}
      },
      lineErr: '',
      tableLoading: false,
      dialogVisible: false
    };
  },
  created() {
    this.getScoreYearList();
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
    async getScoreYearList() {
      let n = {
        enter_status: this.sec_state,
        school_id: this.sec_schoolName,
        major_id: this.sec_majorName,
        ky_year: this.$route.query.id,
        page: this.currentPage,
        limit: this.pageSize,
        tenant_id: window.localStorage.getItem('HARBOR_ID')
      };
      this.tableLoading = true;
      let { result } = await api.getScoreYearList(n);
      this.scoreList = result.items;
      this.listTotal = result.total;
      this.tableLoading = false;
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
     * 导出模板
     */

    async getExport(n) {
      let res = await api.getScoreExport({
        ky_year: n
      });
      this.$refs.upload.isloading = false;
      download(res, '分数线数据明细');
    },
    /**
     * 保存分数线
     */
    async saveScore() {
      if (this.edit.older.enroll_status == 1 && this.edit.older.score_entry.length < 1) {
        this.lineErr = '请填写分数线';
        return;
      }
      let { message, result, status } = await api.saveScore(this.edit.older);
      if (status == 200) {
        this.$message.success('操作成功');
        this.getScoreYearList();
        this.edit.dialogState = false;
      } else {
        this.$message.error(message);
      }
    },
    /**
     * 触发分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getScoreYearList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getScoreYearList();
    },
    /**
     * 编辑分数线
     */
    editAdmin(val) {
      this.edit.older = JSON.parse(JSON.stringify(val));
      this.edit.older.enroll_status = 1;
      this.edit.dialogState = true;
    },
    handleCancel() {
      this.lineErr = '';
      this.edit.dialogState = false;
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
    width: 280px;
  }
}
input[type='number'] {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  -moz-appearance: textfield;
}
.score_dialog .el-dialog {
  height: 70%;
}
.score_dialog .el-dialog__body {
  max-height: 65%;
  overflow: auto;
}
.title_detail {
  float: left;
  color: rgba(0, 0, 0, 0.6);
  font-size: 20px;
  margin-left: 5px;
  margin-top: -2px;
}
.goback {
  width: 24px;
  height: 24px;
  float: left;
  cursor: pointer;
}
.score_outer .el-drawer {
  overflow: scroll;
}
.score_dialog .el-drawer__header {
  font-weight: bold;
}
.score_outer .el-link--inner {
  line-height: 1.3;
}
</style>
