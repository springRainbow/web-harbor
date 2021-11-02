<template>
  <div class="overview">
    <!-- 顶部提示 -->
    <alert-tip id="overview" title="本页数据每小时更新"></alert-tip>
    <!-- 标题 -->
    <div class="overview_title">
      <span class="overview_title-text title-text">昨日关键指标</span>
      <el-popover placement="right" width="360" trigger="hover">
        <div class="overview_title-popover">
          <div class="overview_title-popover-list" style="font-size: 12px; line-height: 24px">
            <p><b>曝光人数：</b>您发布的图文或视频被多少人看到了。</p>
            <p><b>点击人数：</b>您发布的图文或视频被多少人点击查看了。</p>
            <p><b>新线索人数：</b>有多少人第一次点击了您的咨询卡片。</p>
            <p><b>曝光点击率：</b>点击发布内容的人数占发布内容的总曝光人数的百分比（点击人数/曝光人数）。</p>
            <p><b>点击线索转化率：</b>获得的新线索人数占点击查看发布内容的人数的百分比（新线索人数/点击人数）。</p>
          </div>
        </div>
        <i slot="reference" class="el-icon-question quesiton-icon"></i>
      </el-popover>
    </div>
    <!-- 数据详情展示 -->
    <div class="overview_detail">
      <div class="overview_detail-cont">
        <div class="overview_detail-item">
          <div class="overview_detail-item-name">曝光人数</div>
          <div class="overview_detail-item-value">{{ yesterdayData.sum_explose_user }}</div>
        </div>
        <div class="overview_detail-item">
          <div class="overview_detail-item-name">点击人数</div>
          <div class="overview_detail-item-value">{{ yesterdayData.sum_click_user }}</div>
        </div>
        <div class="overview_detail-item">
          <div class="overview_detail-item-name">新线索人数</div>
          <div class="overview_detail-item-value">{{ yesterdayData.sum_resources_user_new }}</div>
        </div>
        <div class="overview_detail-item">
          <div class="overview_detail-item-name">曝光点击率</div>
          <div class="overview_detail-item-value">{{ yesterdayData.exposure_click_through_rate }}%</div>
        </div>
        <div class="overview_detail-item">
          <div class="overview_detail-item-name">点击线索转化率</div>
          <div class="overview_detail-item-value">{{ yesterdayData.click_lead_conversion_rate }}%</div>
        </div>
      </div>
    </div>
    <!-- 时间选择 -->
    <div class="overview_date">
      <span class="overview_date-text">选择时间：</span>
      <el-date-picker
        v-model="dateTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        class="overview_date-picker"
        value-format="timestamp"
        :clearable="false"
        :picker-options="pickerOptions"
        @change="handleDateChange"
      >
      </el-date-picker>
      <el-button size="mini" type="primary" @click="handleSearchData">查询</el-button>
    </div>
    <!-- 数据容器 -->
    <div class="overview_data">
      <!-- 选项卡 -->
      <div class="overview_data-tabs">
        <el-tabs v-model="tabsId" class="overview_data-tabs-comp" type="card" @tab-click="handleTabsClick">
          <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabOptions" :key="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 图表 -->
      <div class="overview_data-charts">
        <!-- 标题 -->
        <div class="overview_data-charts-title">
          <span class="overview_data-charts-title-text title-text">数据趋势</span>
        </div>
        <!-- 线图 -->
        <div class="overview_data-charts-comp line-chart">
          <line-chart :options="lineChartOptions"></line-chart>
        </div>
        <!-- 饼图容器 -->
        <div class="overview_data-charts-title pie-title" v-if="showPieChart && pieChartOptions.series.data[0]">
          <div class="overview_data-charts-title-text title-text">线索咨询方式分布</div>
        </div>
        <!-- 饼图 -->
        <div class="overview_data-charts-comp pie-chart" v-if="showPieChart && pieChartOptions.series.data[0]">
          <pie-chart type="ring" percentage :options="pieChartOptions"></pie-chart>
        </div>
      </div>
    </div>
    <!-- 数据明细 -->
    <div class="overview_table">
      <div class="overview_table-title">
        <span class="overview_table-text title-text">数据明细</span>
        <el-popover placement="right" width="360" trigger="hover">
          <div class="overview_title-popover">
            <div class="overview_title-popover-list" style="font-size: 12px; line-height: 24px">
              <p><b>曝光人数：</b>您发布的图文或视频被多少人看到</p>
              <p><b>点击人数：</b>您发布的图文或视频被多少人点击查看了。</p>
              <p><b>新线索人数：</b>有多少人第一次点击了您的咨询卡片。</p>
              <p><b>评论量：</b>您发布的图文或视频的评论数量。</p>
              <p><b>点赞量：</b>您发布的图文或视频的点赞次数。</p>
              <p><b>收藏量：</b>您发布的图文或视频的收藏次数。</p>
            </div>
          </div>
          <i slot="reference" class="el-icon-question quesiton-icon"></i>
        </el-popover>
        <div class="overview_table-download" @click="handleDownloadData" v-if="tableData[0]">
          <i class="overview_table-download-icon el-icon-download"></i>
          <span class="overview_table-download-text">下载数据</span>
        </div>
      </div>
      <el-table class="overview_table-cont" :data="tableData">
        <el-table-column prop="day" label="时间"></el-table-column>
        <el-table-column prop="sum_explose_user" label="曝光人数"></el-table-column>
        <el-table-column prop="sum_click_user" label="点击人数"></el-table-column>
        <el-table-column prop="sum_resources_user_new" label="新线索人数"> </el-table-column>
        <el-table-column prop="sum_comment_num" label="评论量"> </el-table-column>
        <el-table-column prop="sum_like_num" label="点赞量"> </el-table-column>
        <el-table-column prop="sum_collect_num" label="收藏量"> </el-table-column>
      </el-table>
      <div class="overview_table-pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="limit"
          hide-on-single-page
          layout="total,  prev, pager, next, sizes, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../_api';
import { download } from '@/utils/download';
import LineChart from '../../components/line-chart';
import PieChart from '../../components/pie-chart';
import AlertTip from '../../components/alert-tip';

let thisVue = null; // 当前vue对象
export default {
  name: 'overview',
  props: {},
  data() {
    return {
      dateTime: [],
      tabsId: 'sum_explose_user', // 选项卡标识(本次数据)
      cacheTabsId: 'sum_explose_user', // 选项卡标识(上次数据)
      showPieId: 'sum_resources_user_new', // 显示饼图tab标识
      tabsName: '曝光人数', // 选项卡名称
      showPieChart: false, // 是否展示饼图
      tabOptions: [
        {
          label: '曝光人数',
          name: 'sum_explose_user'
        },
        {
          label: '点击人数',
          name: 'sum_click_user'
        },
        {
          label: '新线索人数',
          name: 'sum_resources_user_new'
        },
        {
          label: '曝光点击率',
          name: 'exposure_click_through_rate'
        },
        {
          label: '点击线索转化率',
          name: 'click_lead_conversion_rate'
        }
      ],
      // 线形图配置
      lineChartOptions: {
        xAxis: {
          data: []
        },
        series: {
          data: []
        }
      },
      // 线图数据
      lineChartData: {},
      // 饼图配置
      pieChartOptions: {
        name: '线索人数',
        series: {
          data: []
        }
      },
      // 饼图数据
      pieChartData: {},
      tableData: [],
      page: 1,
      limit: 50,
      total: 0,
      maxSelectTime: 30, // 最大可选时间范围
      // 昨日关键指标
      yesterdayData: {
        click_lead_conversion_rate: 0, // 点击线索转化率
        exposure_click_through_rate: 0, // 曝光点击率
        sum_resources_user_new: 0, // 线索人数
        sum_explose_user: 0, // 曝光人数
        sum_click_user: 0 // 点击人数
      },
      // 搜索参数
      searchData: {},
      timeOptionRange: null,
      bSearch: false
    };
  },
  components: {
    LineChart,
    PieChart,
    AlertTip
  },
  computed: {
    // 日历配置项
    pickerOptions() {
      return {
        disabledDate(time) {
          // 获取选中时间
          let timeOptionRange = thisVue.timeOptionRange;
          // 获取时间范围(30天的毫秒数)
          let secondNum = thisVue.maxSelectTime * (24 * 60 * 60 * 1000);
          if (timeOptionRange) {
            //如果有选中时间 设置超过选中时间后的30天||超过选中前的30天||大于当前时间 不可选
            return (
              time.getTime() > timeOptionRange.getTime() + secondNum ||
              time.getTime() < timeOptionRange.getTime() - secondNum ||
              time.getTime() > Date.now() - 8.64e6
            );
          } else {
            //如果没有选中时间（初始化状态） 设置当前时间后的时间不可选
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        onPick(maxDate) {
          // 当选中了第一个日期还没选第二个
          // 只选中一个的时候自动赋值给minDate，当选中第二个后组件自动匹配，将大小日期分别赋值给maxDate、minDate
          if (maxDate.minDate && !maxDate.maxDate) {
            thisVue.timeOptionRange = maxDate.minDate;
          }
          // 如果有maxDate属性，表示2个日期都选择了，则重置timeOptionRange
          if (maxDate.maxDate) {
            thisVue.timeOptionRange = null;
          }
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
    // 日期切换
    handleDateChange(res) {
      console.log(res);
      this.searchData = res
        ? {
            user_view_start_time: parseInt(res[0] / 1000),
            user_view_end_time: parseInt(res[1] / 1000)
          }
        : {};
    },
    // 查询
    async handleSearchData() {
      if (this.bSearch) return;
      // 设置不可搜索
      this.bSearch = true;
      // 获取线图数据
      await this.getOverviewIndicators();
      // 获取饼图数据
      await this.getConsultingCluesWay();
      // 获取数据明细
      await this.getOverviewDetail();
      // 设置可搜索
      this.bSearch = false;
    },
    // tab切换
    handleTabsClick(res) {
      let { label, name } = res;
      if (this.tabsId == this.cacheTabsId) return;

      this.cacheTabsId = name; // 设置tab标识
      this.tabsName = label; // 设置显示名称

      // 设置线型图表数据
      this.setLineOptions();
      // 是否显示饼图
      this.showPieChart = this.tabsId == this.showPieId;
    },
    // 显示数量切换
    handleSizeChange(res) {
      this.limit = res;
      this.page = 1;
      this.getOverviewDetail();
    },
    // 当前页码切换
    handleCurrentChange(res) {
      this.page = res;
      this.getOverviewDetail();
    },
    // 下载数据
    handleDownloadData() {
      // 下载数据
      this.getDownloadOverview();
    },

    // 设置线图图表数据
    setLineOptions(data = this.lineChartData) {
      let { day } = data;
      this.lineChartOptions.series.name = this.tabsName;
      this.lineChartOptions.xAxis.data = day;
      this.lineChartOptions.series.data = data[this.cacheTabsId];
    },
    // 设置饼图图表数据
    setPieOptions(data = this.pieChartData) {
      this.pieChartOptions.series.data = data;
    },

    // 获取昨日关键指标(顶部数据)
    async getYesterdayOverview() {
      let { status, result, message } = await api.getYesterdayOverview();
      if (status == 200) {
        // 设置昨日关键指标
        this.yesterdayData = result ? result : this.yesterdayData;
      } else {
        this.$message.error(message);
      }
    },
    // 获取关键指标数据趋势(线图)
    async getOverviewIndicators(params = this.searchData) {
      let { status, result, message } = await api.getOverviewIndicators(params);
      if (status == 200) {
        // 设置线图数据
        this.lineChartData = result;
        // 设置线图数据
        this.setLineOptions();
      } else {
        this.$message.error(message);
      }
    },
    // 获取线索咨询方式分布(饼图)
    async getConsultingCluesWay(params = this.searchData) {
      let { status, result, message } = await api.getConsultingCluesWay(params);
      if (status == 200) {
        // 设置饼图数据
        this.pieChartData = result;
        // 设置饼图数据
        this.setPieOptions();
      } else {
        this.$message.error(message);
      }
    },
    // 获取数据明细(table)
    async getOverviewDetail() {
      let params = { ...this.searchData, page: this.page, limit: this.limit };
      let { status, result, message } = await api.getOverviewDetail(params);
      if (status == 200) {
        // 设置表格数据
        this.tableData = result;
        this.total = result.length;
      } else {
        this.$message.error(message);
      }
    },
    // 下载数据明细
    async getDownloadOverview() {
      let params = { ...this.searchData, page: this.page, limit: this.limit };
      let res = await api.getDownloadOverview(params);
      download(res, '数据明细', 'xls');
    }
  },
  created() {
    thisVue = this;
    let now = Date.now();
    let beginTime = now - 3600 * 1000 * 24 * 7; // 一周前

    this.dateTime = [beginTime, now];
    this.searchData = {
      user_view_start_time: parseInt(beginTime / 1000),
      user_view_end_time: parseInt(now / 1000)
    };

    // 搜索
    this.handleSearchData();
    // 获取昨日数据
    this.getYesterdayOverview();
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
$borderColor: #f0f0f0;
$defaultColor: #4bdae4;
$activeColor: #15cfdc;

.mb8 {
  margin-bottom: 8px;
}

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

.overview {
  padding: 30px;
  background: #fff;
  box-sizing: border-box;

  &_alert {
    margin-bottom: 20px;
    border: 1px solid #fce6c5;
    color: #f5a020;
    background: #fef5e9;
    font-size: 14px;

    /deep/ .el-alert__closebtn {
      color: #999;
      font-size: 14px;
    }
  }

  /* 标题 */
  .title-text {
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    margin-right: 4px;
  }
  /* 问号 */
  .quesiton-icon {
    color: #ccc;
  }

  /* 标题 */
  &_title {
    margin-bottom: 8px;
  }

  /* 数据详情展示 */
  &_detail {
    width: 100%;
    background: #f7fcfd;
    padding: 32px 8px;
    margin-bottom: 32px;
    box-sizing: border-box;

    &-cont {
      display: flex;
    }

    &-item {
      height: 56px;
      border-right: 1px solid #ebebeb;
      box-sizing: border-box;
      text-align: center;
      flex: 1;

      &-name {
        font-size: 14px;
        margin-bottom: 6px;
      }

      &-value {
        font-size: 30px;
        font-weight: bold;
        line-height: 28px;
      }

      &:last-child {
        border: none;
      }
    }
  }

  /* 日期选择 */
  &_date {
    margin-bottom: 24px;

    &-text {
      margin-right: 8px;
    }

    &-picker {
      width: 220px;
      margin-right: 20px;
    }
  }

  /* 选项卡 */
  &_data {
    margin-bottom: 24px;

    /* 选项卡 */
    &-tabs {
      &-comp {
        /deep/ .el-tabs__header {
          margin: 0;
          border-bottom: none;

          .el-tabs__nav {
            float: none;
            display: flex;
            border-bottom: none;
            border-radius: 0;

            .el-tabs__item {
              flex: 1;
              border-top: 1px solid $borderColor;
              //border-top: 4px solid transparent;
              text-align: center;
              line-height: 38px;
              background: #fafafa;
              margin-top: -1px;

              &.is-active {
                border-top: 4px solid $activeColor;
                background: #fff;
                line-height: 32px;
              }
            }
          }
        }
      }
    }

    /* 图表 */
    &-charts {
      border: 1px solid $borderColor;
      border-top: none;

      &-title {
        padding-top: 16px;
        margin-bottom: 4px;

        &-text {
          margin-left: 24px;
        }

        &.pie-title {
          margin: 0 24px;
          border-top: 1px solid $borderColor;

          .title-text {
            margin-left: 0;
          }
        }
      }

      /* 缺省 */
      &-default {
        background: #f7fcfd;
        color: $defaultColor;
        text-align: center;
        line-height: 330px;
        font-size: 30px;
        position: absolute;
        left: 10px;
        right: 10px;
        top: 10px;
        bottom: 10px;
        z-index: 1;
      }

      &-comp {
        box-sizing: border-box;

        &.line-chart {
          padding: 10px;
          height: 330px;
          position: relative;
        }

        &.pie-chart {
          height: 260px;
          padding: 10px;
        }
      }
    }
  }

  /* 表格 */
  &_table {
    margin-bottom: 40px;

    &-cont {
      margin-bottom: 24px;
    }

    &-pagination {
      text-align: right;
    }

    &-title {
      @extend .clearfix;
      margin-bottom: 12px;
    }

    &-download {
      float: right;
      color: $defaultColor;
      cursor: pointer;

      &:hover {
        color: $activeColor;
      }
    }
  }
}
</style>
