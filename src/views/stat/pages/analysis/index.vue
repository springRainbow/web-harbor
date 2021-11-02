<template>
  <div class="analysis">
    <!-- 顶部提示 -->
    <alert-tip id="analysis" title="本页数据每小时更新"></alert-tip>
    <div class="analysis_type">
      <div class="analysis_type-item">
        <span class="analysis_type-text">内容分类：</span>
        <el-radio-group class="analysis_type-radio" v-model="search.top_category">
          <el-radio :label="-1">全部内容</el-radio>
          <el-radio :label="2">通识内容</el-radio>
          <el-radio :label="1">专业内容</el-radio>
        </el-radio-group>
        <!-- <el-select v-if="search.top_category == 1" v-model="search.major_ids" size="mini" multiple>
        <el-option
          v-for="item in contentOptions"
          :key="item.major_id"
          :value="item.major_id"
          :label="item.major_name"
        ></el-option>
      </el-select> -->
      </div>
      <div class="analysis_type-item">
        <span class="analysis_type-text">内容类型：</span>
        <el-radio-group class="analysis_type-radio" v-model="search.news_type">
          <el-radio :label="0">图文</el-radio>
          <el-radio :label="1">视频</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="analysis_detail">
      <div class="analysis_detail-title">
        <!-- 搜索项 -->
        <el-form :model="search" ref="form" inline size="mini">
          <!-- <el-form-item label="内容分类：">
            <el-radio-group class="analysis_type-radio" v-model="search.top_category" @change="handleTypeChange">
              <el-radio-button :label="-1">全部内容</el-radio-button>
              <el-radio-button :label="2">通识内容</el-radio-button>
              <el-radio-button :label="1">专业内容</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-radio-group v-model="search.news_type">
              <el-radio-button :label="0">图文</el-radio-button>
              <el-radio-button :label="1">视频</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="内容发布时间：">
            <el-date-picker
              v-model="dateTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              class="analysis_detail-date"
              :clearable="false"
              :picker-options="pickerOptions"
              @change="handleDateChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="内容标题：">
            <el-input v-model="search.news_name" clearable placeholder="查询文章标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item class="analysis_detail-button" v-if="tableData[0]">
            <div class="analysis_detail-download" @click="handleDownloadData">
              <i class="analysis_detail-download-icon el-icon-download"></i>
              <span class="analysis_detail-download-text">下载数据</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="analysis_detail-table">
        <el-table class="analysis_detail-table-cont" size="mini" max-height="820" :data="tableData" v-loading="loading">
          <el-table-column prop="news_id" label="ID"></el-table-column>
          <el-table-column prop="news_name" label="内容名称"></el-table-column>
          <el-table-column prop="news_pulish_day_format" label="发布时间"></el-table-column>
          <el-table-column prop="second_major_ids" label="专业名称"></el-table-column>
          <el-table-column prop="news_type_text" label="内容类型"></el-table-column>
          <el-table-column prop="explose_num" label="曝光量"> </el-table-column>
          <el-table-column prop="explose_user" label="曝光人数"> </el-table-column>
          <el-table-column prop="click_num" label="点击量"> </el-table-column>
          <el-table-column prop="click_user" label="点击人数"> </el-table-column>
          <el-table-column prop="resources_num" label="线索人数"> </el-table-column>
          <el-table-column prop="resources_user" label="新线索人数" width="100"> </el-table-column>
          <el-table-column prop="comment_num" label="评论量"> </el-table-column>
          <el-table-column prop="avg_view_duration" label="平均浏览时长(秒)" width="130"> </el-table-column>
          <el-table-column prop="like_num" label="点赞量"> </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <div class="analysis_detail-table-button" @click="handleDetail(scope.row)">详情</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页码 -->
        <div class="analysis_detail-table-pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="search.page"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="search.limit"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../_api';
import { download } from '@/utils/download';
import AlertTip from '../../components/alert-tip';

let thisVue = null; // 当前vue对象
export default {
  name: 'analysis',
  props: {},
  data() {
    return {
      uuid: this.$route.query.u,
      alertStatus: this.$cookie.get('analysis-alert'),
      maxSelectTime: 30, // 最大可选时间范围
      timeOptionRange: null,
      dateTime: [], // 筛选时间
      // tab配置
      typeOption: [
        {
          value: 0,
          label: '全部内容'
        },
        {
          value: 1,
          label: '心理学'
        },
        {
          value: 2,
          label: '教育学'
        }
      ],
      // 搜索数据
      search: {
        top_category: -1,
        news_name: '',
        news_type: 0,
        major_ids: [], // 专业
        limit: 10,
        page: 1
      },
      contentOptions: [], // 二级菜单数据
      tableData: [], // 列表数据
      total: 0, // 列表总数据
      loading: false, // 是否加载
      bSearch: false // 是否已搜索
    };
  },
  components: {
    AlertTip
  },
  computed: {
    // 日历配置项
    pickerOptions() {
      return {
        disabledDate(time) {
          //如果没有选中时间（初始化状态） 设置当前时间后的时间不可选
          return time.getTime() > Date.now() - 8.64e6;
        },
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          } /* ,
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          } */
        ]
      };
    }
  },
  methods: {
    // 关闭顶部提示
    handleCloseAlert() {
      this.$cookie.set('analysis-alert', 1, {
        expires: 31,
        domain: '.qz100.com'
      });
    },
    // 时间切换
    handleDateChange(res) {
      if (res) {
        this.search.news_publish_start_day = parseInt(res[0] / 1000);
        this.search.news_publish_end_day = parseInt(res[1] / 1000);
      } else {
        this.search.news_publish_start_day = '';
        this.search.news_publish_end_day = '';
      }
    },
    // 查询按钮
    handleSearch() {
      if (this.bSearch) return;
      this.bSearch = true;
      this.loading = true;
      this.search.page = this.page;
      this.search.limit = this.limit;

      // 获取列表
      this.getNewsList();
    },
    // 下载数据
    handleDownloadData() {
      this.getDownloadNewsList();
    },
    // 查看详情
    handleDetail(row) {
      let { news_id } = row;

      this.$router.push({
        path: '/stat/detail',
        query: { u: this.uuid, news_id }
      });
    },
    // 显示数量切换
    handleSizeChange(res) {
      this.search.limit = res;
      this.search.page = 1;
      this.getNewsList();
    },
    // 当前页码切换
    handleCurrentChange(res) {
      this.search.page = res;
      this.getNewsList();
    },

    // 获取二级专业数据
    async getNewsMajor() {
      let { result, status, message } = await api.getNewsMajor();
      if (status == 200) {
        this.contentOptions = result;
      } else {
        this.$message.error(message);
      }
    },
    // 获取分析列表
    async getNewsList(params = this.search) {
      let { result, status, message } = await api.getNewsList(params);
      if (status == 200) {
        let { data, total, current_page } = result;
        this.loading = false;
        this.tableData = data;
        this.total = total;
        this.search.page = current_page;
      } else {
        this.$message.error(message);
      }
      this.bSearch = false;
    },
    // 下载内容分析列表
    async getDownloadNewsList(params = this.search) {
      let res = await api.getDownloadNewsList(params);
      download(res, '分析列表', 'xls');
    }
  },
  created() {
    thisVue = this;
    let now = Date.now();
    let beginTime = now - 3600 * 1000 * 24 * 30; // 开始时间 30天前
    // 设置搜索时间
    this.search.news_publish_start_day = parseInt(beginTime / 1000);
    this.search.news_publish_end_day = parseInt(now / 1000);
    // 设置默认时间
    this.dateTime = [beginTime, now];
    // 搜索
    this.handleSearch();
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
$borderColor: #f0f0f0;
$defaultColor: #4bdae4;
$activeColor: #15cfdc;

.clearfix {
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    font-size: 0;
    clear: both;
  }
}

.analysis {
  padding: 30px;
  box-sizing: border-box;
  background: #fff;

  &_type {
    /* padding-bottom: 16px;
    margin-bottom: 24px;
    border-bottom: 1px solid #ebebeb; */

    &-item {
      color: #606266;
      display: block;
      margin-right: 16px;
      margin-bottom: 14px;
    }

    &-text {
      display: inline-block;
      margin-right: 4px;
      line-height: 24px;
      vertical-align: middle;
    }

    &-radio {
      .el-radio {
        margin-right: 12px;

        /deep/ .el-radio__label {
          padding-left: 6px;
          line-height: 24px;
        }
      }
    }
  }

  &_detail {
    /* 筛选标题 */
    &-title {
      margin-bottom: 6px;
      /* margin-bottom: 24px;
      border-bottom: 1px solid #ebebeb; */
    }

    &-date {
      width: 220px;
    }

    &-button {
      float: right;
      color: $defaultColor;
      cursor: pointer;

      &:hover {
        color: $activeColor;
      }
    }

    &-table {
      &-cont {
        max-height: 500px;
        margin-bottom: 20px;
      }

      &-button {
        color: $defaultColor;
        cursor: pointer;

        &:hover {
          color: $activeColor;
        }
      }

      &-pagination {
        text-align: right;
      }
    }
  }

  .el-form-item {
    margin-right: 16px;
  }
}
</style>
