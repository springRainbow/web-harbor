<template>
  <div class="books_outer">
    <div class="books_top">
      <p class="color0 ft14 op8" style="font-weight: bold">分数线｜报录比管理</p>
      <p class="top_commit color0 ft14">
        分数比、报录比作为考研用户择校专业的重要依据，是考研用户最关注的结构性信息之一。补充院校*专业「分数线/报录比」即可在该院校*专业分数线/报录比模块获得机构「信息曝光」及相关「服务推荐」。
        <br />
        <span style="margin-top: 15px; displyy: inline-block">
          注意：补充信息即代表对应院校*专业被您「占领」,
          您将在对应院校*专业模块获得唯一曝光权益。未及时补充有可能被其他机构或平台抢先占领曝光位哦~
        </span>
        <br />
        <img src="~@/assets/content/icon_course.png" class="icon_course" />
        <span style="position: relative" class="img_outer">
          <el-link type="primary">点击查看曝光位</el-link>
          <el-image
            style="width: 100px; height: 30px; opacity: 0; position: absolute; left: 0; top: 0"
            :src="require('../../../../assets/content/icon_course.png')"
            :preview-src-list="[require('../../../../assets/content/line_preview.png')]"
          ></el-image>
        </span>
      </p>
    </div>

    <el-tabs class="score_table" v-model="activeName" @tab-click="changeTab" style="margin-top: 10px">
      <el-tab-pane label="补充分数线" name="score"></el-tab-pane>
      <el-tab-pane label="补充报录比" name="stat"></el-tab-pane>
    </el-tabs>
    <div>
      <p class="lf_icon_title" style="margin-bottom: 16px">经营数据</p>
      <el-table :data="scoreList" v-loading="loading" style="width: 100%">
        <el-table-column :prop="loadtype == 2 ? 'enroll_year' : 'ky_year'" label="考研届"></el-table-column>
        <el-table-column prop="enroll_total" label="院校*专业"></el-table-column>
        <el-table-column prop="enter_num" label="被其他机构占领"></el-table-column>
        <el-table-column prop="surplus_num" label="需维护数量"></el-table-column>
        <el-table-column prop="is_fill_num" label="已补充"></el-table-column>
        <el-table-column prop="not_fill_num" label="未补充">
          <template slot-scope="scope">
            <span style="color: rgba(237, 64, 70, 1)">{{ scope.row.not_fill_num }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="not_fill_num" label="操作">
          <template slot-scope="scope">
            <div class="edit_scope" style="color: #d8d8d8">
              <el-link type="primary" @click="jurmp(scope)">查看详情</el-link>&nbsp;|
              <el-link
                type="primary"
                @click="
                  year = scope.row.ky_year || scope.row.enroll_year;
                  dialogVisible = true;
                "
                >批量上传</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <uploadex
      :year="year"
      ref="upload"
      :loadtype="loadtype"
      v-if="dialogVisible"
      v-on:export-cli="getExport"
      :dialogVisible="dialogVisible"
      :visible.sync="dialogVisible"
    ></uploadex>
  </div>
</template>
<script>
import api from '../../_api';
import { download } from '@/utils/download';

import uploadex from '@/components/books/uploadex.vue';

export default {
  name: 'score',
  data() {
    return {
      activeName: 'score',
      scoreList: [], //分数线列表
      tenant_uuid: window.localStorage.getItem('HARBOR_ID'), //当前机构id
      dialogVisible: false, //上传弹框
      loadtype: 1, //1分数线 2报录比
      loading: false,
      year: ''
    };
  },
  created() {
    if (window.localStorage.getItem('scoreType') == 2) {
      //报录比
      this.activeName = 'stat';
      this.loadtype = 2;
      this.getStatList();
      return;
    }

    this.getScoreList();
  },
  methods: {
    /**
     * 获取分数列表
     */
    async getScoreList() {
      this.loading = true;
      let { result } = await api.getScoreList();
      this.scoreList = result;
      this.loading = false;
    },
    /**
     * 报录比列表
     */
    async getStatList() {
      this.loading = true;
      let { result } = await api.getStatList();
      this.scoreList = result;
      this.loading = false;
    },

    /**
     * 切换分数线报录比tab
     */
    changeTab(n, m) {
      if (n.index == 1) {
        //报录比
        this.loadtype = 2;
        window.localStorage.setItem('scoreType', 2);
        this.getStatList();
      } else {
        this.loadtype = 1; //分数线
        window.localStorage.setItem('scoreType', 1);
        this.getScoreList();
      }
    },
    //导出模板
    async getExport(n) {
      if (this.loadtype == 1) {
        //分数线
        let res = await api.getScoreExport({
          ky_year: n
        });
        download(res, '分数线数据明细');
      } else {
        //报录比
        let res = await api.getExport({
          year: n
        });
        download(res, '报录比数据明细');
      }

      this.$refs.upload.isloading = false;
    },
    //跳转
    jurmp(scope) {
      let s = this.activeName == 'score' ? 'scoredetail' : 'statdetail';
      this.$router.push({ name: s, query: { id: scope.row.ky_year || scope.row.enroll_year, u: this.$route.query.u } });
    }
  },
  components: {
    uploadex
  },
  filters: {}
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
.books_outer {
  padding: 30px;
  box-sizing: border-box;
  background: white;
}
.score_top {
  width: 100%;
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
.books_outer .el-tabs__nav-wrap::after {
  display: none;
}
.score_table .el-tabs__content {
  overflow: visible;
}
.score_dialog .el-dialog__body {
  padding-top: 10px;
}
.score_table .el-tabs__item {
  font-weight: normal;
  opacity: 0.6;
}
.score_table .el-tabs__item:hover {
  opacity: 1;
}
.score_table .el-tabs__item.is-active {
  font-weight: bold;
  opacity: 1;
}
.books_outer .el-link--inner {
  line-height: 1.3;
}
.img_outer:hover .el-link--inner {
  text-decoration: underline;
}
</style>
