<template>
  <div class="books_outer">
    <div class="books_top">
      <p class="color0 ft14 op8" style="font-weight: bold">参考书管理</p>
      <p class="top_commit color0 ft14">
        参考书包含在备考过程中所有必看专业课书籍。该模块为院校*专业下的参考书推荐及评价，通过上传参考书信息及对参考书的推荐评语，获得在「参考书」模块下的曝光，是内容影响用户的重要途径。
        <img src="~@/assets/content/icon_course.png" class="icon_course" />
        <span style="position: relative" class="img_outer">
          <el-link type="primary">点击查看曝光位</el-link>
          <el-image
            style="width: 100px; height: 30px; opacity: 0; position: absolute; left: 0; top: 0; z-index: 99"
            :src="require('../../../../assets/content/icon_course.png')"
            :preview-src-list="[require('../../../../assets/content/book_preview.png')]"
          ></el-image>
        </span>
      </p>
    </div>
    <p class="lf_icon_title">参考书列表</p>
    <div style="overflow: hidden; margin-bottom: 20px; margin-top: 20px">
      <el-button type="primary" round @click="addlogSate = true">+ 新增参考书</el-button>
      <!-- 检索条件部分 -->
      <div class="seach_wrap">
        <el-input v-model="sec_bookName" placeholder="搜索书名"></el-input>
        <major-select :include_second="0" :include_third="1" v-on:change-edit="majorChange"></major-select>
        <school-select v-on:change-edit="schoolChange"></school-select>
        <teant-select v-on:change-edit="tenantChange"></teant-select>
        <el-select v-model="sec_bookState" placeholder="是否完成书评">
          <el-option value label>请选择</el-option>
          <el-option :value="1" label="是"></el-option>
          <el-option :value="2" label="否"></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="
            currentPage = 1;
            getBooksList();
          "
          round
          >查询</el-button
        >
      </div>
    </div>
    <booksForm
      v-show="addlogSate"
      :visible.sync="addlogSate"
      :SchoolMajor="SchoolMajor"
      editType="1"
      bookId
      v-on:dialog="addlogSate = false"
      direction="rtl"
      title="新增参考书"
      size="50%"
    ></booksForm>
    <!-- 表格部分 -->
    <el-table :data="booksList" v-loading="tableLoading" header-row-class-name="header_tr_scend" style="width: 100%">
      <el-table-column prop="uuid" width="40" label="ID">
        <template slot-scope="scope">{{ scope.row.iota }}</template>
      </el-table-column>
      <el-table-column prop="book_name" label="书名">
        <template slot-scope="scope">
          <el-link @click="toComment(scope.row.uuid)" style="font-size: unset">
            {{ scope.row.book_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cover_img" width="75" label="封面">
        <template slot-scope="scope">
          <div>
            <el-image style="width: 54px; height: 70px" :src="scope.row.cover_img" fit="contain"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="简介"></el-table-column>
      <el-table-column prop="author" width="100" label="作者"></el-table-column>
      <el-table-column prop="address" label="专业院校标签">
        <template slot-scope="scope">
          <span v-for="(i, n) in scope.row.relation" :key="i.id">
            {{ i.major_name + '-' + i.school_name }}
            <i v-show="n + 1 != scope.row.relation.length">/</i>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="tenant_name" width="80" label="上传机构"></el-table-column>
      <el-table-column prop="is_recommend" width="110" label="是否完成书评">
        <template slot-scope="scope">
          <div>{{ scope.row.is_recommend | vaildFilters }}</div>
        </template>
      </el-table-column>
      <el-table-column width="140" prop="is_recommend" label="操作">
        <template slot-scope="scope">
          <div class="edit_scope">
            <el-link type="primary" @click="jurmp(scope.row.uuid)">编辑书目</el-link>｜
            <el-link type="primary" @click="toComment(scope.row.uuid)" v-if="scope.row.is_recommend == 1"
              >编辑书评</el-link
            >
            <el-link type="primary" @click="toComment(scope.row.uuid)" v-else>写书评</el-link>
          </div>
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
        layout="prev, pager, next,sizes,total"
        :page-sizes="[20, 50, 100]"
        :page-size="20"
        :total="booksTotal"
        hide-on-single-page
      ></el-pagination>
    </div>
    <booksForm
      title="编辑参考书"
      v-show="editSate"
      :bookId="bookId"
      editType="2"
      :SchoolMajor="SchoolMajor"
      v-on:dialog="editSate = false"
      :visible.sync="editSate"
      direction="rtl"
      size="50%"
    ></booksForm>
  </div>
</template>
<script>
import api from '../../_api';
import booksForm from '@/components/books/booksform.vue';
import majorSelect from '@/components/books/majorselect.vue';
import schoolSelect from '@/components/books/schoolselect.vue';
import teantSelect from '@/components/books/teantselect.vue';
import VueCookie from 'vue-cookie';
export default {
  name: 'books',
  data() {
    return {
      sec_bookName: '', //搜索书名
      sec_schoolName: '', //搜索院校
      sec_majorName: '', //搜索专业
      sec_organName: '', //搜索机构名
      sec_bookState: '', //是否完成书评
      currentPage: 1, //当前第几页
      pageSize: 20,
      booksTotal: 0,
      addlogSate: false, //添加参考书
      editSate: false, //编辑参考书
      bookId: '', //当前操作的参考书
      tableLoading: false,
      SchoolMajor: {
        majors: [],
        schools: []
      }, //当前机构下经营范围的院校专业
      booksList: []
    };
  },
  created() {
    this.getBooksList();
    this.getSchoolMajor();
  },
  methods: {
    jurmp(n) {
      this.editSate = true;
      this.bookId = n;
    },
    /**
     * 获取参考书列表
     */
    async getBooksList() {
      this.tableLoading = true;
      let data = {
        book_name: this.sec_bookName,
        school_id: this.sec_schoolName,
        major_third_id: this.sec_majorName,
        search_tenant_uuid: this.sec_organName,
        recommend_type: this.sec_bookState,
        page: this.currentPage,
        limit: this.pageSize
      };
      let { result } = await api.getBooksList(data);
      this.booksList = result.items;
      this.booksTotal = result.total;
      this.tableLoading = false;
    },

    /**
     * 获取当前机构下院校专业
     */
    async getSchoolMajor() {
      let { result } = await api.getSchoolMajor({});
      this.SchoolMajor = result;
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
     * 机构选择
     */
    tenantChange(res) {
      this.sec_organName = res;
    },
    /**
     * 触发分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBooksList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBooksList();
    },

    /**
     * 写书评/编辑书评
     */
    toComment(val) {
      this.$router.push({
        path: `bookscomment`,
        query: {
          id: val,
          u: this.$route.query.u
        }
      });
    }
  },
  components: {
    booksForm,
    majorSelect,
    schoolSelect,
    teantSelect
  },
  filters: {
    /**
     * 书评状态
     */
    vaildFilters(val) {
      switch (val) {
        case 1:
          return '是';
          break;
        case 2:
          return '否';
          break;
        default:
          return '否';
      }
    }
  }
};
</script>
<style lang="scss" scpoed>
.color0 {
  color: #000;
}
.ft14 {
  font-size: 14px;
}
.op8 {
  opacity: 0.8;
}
.op6 {
  opacity: 0.6;
}
a,
img {
  cursor: pointer;
}
.top_commit {
  line-height: 1.5;
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.6);
  a {
    color: #15cfdc;
    font-weight: bold;
    opacity: 1;
  }
}

.books_outer {
  padding: 30px;
  box-sizing: border-box;
  background: white;
}
.books_top {
  width: 100%;
  padding: 20px 32px;
  box-sizing: border-box;
  background: url('~@/assets/content/commit_bg.png') no-repeat;
  background-size: cover;
}
.icon_course {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
  top: 5px;
}
.lf_icon_title {
  font-size: 14px;
  color: #000;
  padding-left: 28px;
  margin: 24px 0 20px -30px;
  opacity: 0.8;
  margin-bottom: 0;
  position: relative;
  &::before {
    content: '';
    width: 4px;
    height: 100%;
    background: $mainColor;
    border-radius: 2px;
    position: absolute;
    left: 0;
  }
}
.seach_wrap {
  float: right;
}
.seach_wrap > .el-input {
  width: 112px;
  margin-right: 12px;
}
.seach_wrap .el-select {
  width: 142px;
  margin-right: 12px;
}
.paination_wrap {
  margin-top: 30px;
  text-align: center;
}
.paination_wrap .el-pager .number.active {
  background: white;
  color: #15cfdc;
}
.edit_scope {
  color: #d8d8d8;
  a {
    color: #15cfdc;
    font-size: 12px;
  }
}
.books_outer .el-table .cell {
  -webkit-line-clamp: 5;
  line-clamp: 5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.books_outer .el-link--inner {
  line-height: 1.3;
  text-align: justify;
  font-weight: normal;
}
.img_outer:hover .el-link--inner {
  text-decoration: underline;
}
</style>
