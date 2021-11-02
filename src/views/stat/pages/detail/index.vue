<template>
  <div class="detail">
    <!-- 顶部提示 -->
    <alert-tip id="detail" title="本页数据每小时更新"></alert-tip>
    <!-- 主标题 -->
    <div class="detail_title" v-if="title">
      <div class="detail_title-text">{{ title }}</div>
      <div class="detail_title-date" v-if="updateTime">发布时间：{{ updateTime }}</div>
    </div>
    <!-- 关键指标 -->
    <div class="detail_indicators">
      <span class="detail_indicators-text title-text">关键指标</span>
      <el-popover placement="right" width="360" trigger="hover">
        <div class="detail_indicators-popover">
          <div class="detail_indicators-popover-list" style="font-size: 12px; line-height: 24px">
            <p><b>曝光人数：</b>您发布的图文或视频被多少人看到了。</p>
            <p><b>点击人数：</b>您发布的图文或视频被多少人点击查看了。</p>
            <p><b>新线索人数：</b>有多少人第一次点击了您图文或视频中的咨询卡片。</p>
            <p><b>平均浏览时长：</b>您发布的图文或视频被浏览的平均时长。</p>
            <p><b>评论量：</b>您发布的图文或视频的评论数量。</p>
            <p><b>点赞量：</b>您发布的图文或视频的点赞次数。</p>
          </div>
        </div>
        <i slot="reference" class="el-icon-question quesiton-icon"></i>
      </el-popover>
    </div>
    <!-- 指标数据 -->
    <div class="detail_box">
      <div class="detail_box-cont">
        <div class="detail_box-item">
          <div class="detail_box-item-name">曝光人数</div>
          <div class="detail_box-item-value">{{ indicatorsData.explose_user }}</div>
        </div>
        <div class="detail_box-item">
          <div class="detail_box-item-name">浏览人数</div>
          <div class="detail_box-item-value">{{ indicatorsData.view_user }}</div>
        </div>
        <div class="detail_box-item">
          <div class="detail_box-item-name">新线索人数</div>
          <div class="detail_box-item-value">{{ indicatorsData.resources_user_new }}</div>
          <span class="detail_box-item-link" v-if="indicatorsData.resources_user_new > 0" @click="handleGoLink"
            >查看新线索明细 <i class="detail_box-item-link-icon el-icon-arrow-right"></i
          ></span>
        </div>
        <div class="detail_box-item">
          <div class="detail_box-item-name">平均浏览时长(秒)</div>
          <div class="detail_box-item-value">{{ indicatorsData.avg_view_duration }}</div>
        </div>
        <div class="detail_box-item">
          <div class="detail_box-item-name">评论量</div>
          <div class="detail_box-item-value">{{ indicatorsData.sum_comment_num }}</div>
        </div>
        <div class="detail_box-item">
          <div class="detail_box-item-name">点赞量</div>
          <div class="detail_box-item-value">{{ indicatorsData.sum_like_num }}</div>
        </div>
      </div>
    </div>
    <!-- 时间选择 -->
    <div class="detail_date">
      <span class="detail_date-text">文章浏览时间：</span>
      <el-date-picker
        v-model="dateTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        class="detail_date-picker"
        :clearable="false"
        :picker-options="pickerOptions"
        @change="handleDateChange"
      >
      </el-date-picker>
      <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
    </div>
    <!-- 数据容器 -->
    <div class="detail_data">
      <!-- 选项卡 -->
      <div class="detail_data-tabs">
        <el-tabs v-model="tabsId" class="detail_data-tabs-comp" type="card" @tab-click="handleTabsClick">
          <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabOptions" :key="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 图表 -->
      <div class="detail_data-charts">
        <!-- 标题 -->
        <div class="detail_data-charts-title">
          <span class="detail_data-charts-title-text title-text">数据总和</span>
        </div>
        <div class="detail_data-charts-datas">{{ timeText ? timeText : '' }} 总{{ tabsName }}为：{{ totalDatas }}</div>
        <!-- 标题 -->
        <div class="detail_data-charts-title">
          <span class="detail_data-charts-title-text title-text">数据趋势</span>
        </div>
        <!-- 线图 -->
        <div class="detail_data-charts-comp line-chart">
          <!-- <div class="detail_data-charts-default" v-if="!lineChartData.day">暂无数据</div> -->
          <line-chart :options="lineChartOptions"></line-chart>
        </div>
        <!-- 画像 -->
        <div class="detail_data-charts-portrait" v-if="showChart">
          <!-- 标题 -->
          <div class="detail_data-charts-portrait-title">
            <span class="detail_data-charts-portrait-title-text title-text">画像</span>
          </div>
          <!-- 画像提示 -->
          <alert-tip
            title="用户可更改画像中的数据选项，可能导致画像各图表的总和与上图中数据总和不一致。"
            :closable="false"
          ></alert-tip>
          <!-- 图表 -->
          <div class="detail_data-charts-portrait-cont">
            <div class="detail_data-charts-portrait-item">
              <pie-chart title="报考年份人数分布" unit="人" :options="exam_year"></pie-chart>
            </div>
            <div class="detail_data-charts-portrait-item">
              <bar-chart title="报考专业人数" xRotate :options="major_name"></bar-chart>
            </div>
            <div class="detail_data-charts-portrait-item">
              <bar-chart title="报考院校人数" xRotate :options="school_name"></bar-chart>
            </div>
            <div class="detail_data-charts-portrait-item">
              <pie-chart title="院校目标" :options="school_target"></pie-chart>
            </div>
            <div class="detail_data-charts-portrait-item">
              <pie-chart title="备考状态" :options="examed_times"></pie-chart>
            </div>
            <div class="detail_data-charts-portrait-item">
              <pie-chart title="当前状态" :options="condition_state"></pie-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import api from '../../_api';

import LineChart from '../../components/line-chart';
import PieChart from '../../components/pie-chart';
import BarChart from '../../components/bar-chart';
import AlertTip from '../../components/alert-tip';

let thisVue = null; // 当前vue对象
export default {
  name: 'detail',
  props: {},
  data() {
    return {
      uuid: this.$route.query.u,
      news_id: this.$route.query.news_id,
      news_uuid: '',
      title: '', // 标题
      beginTime: '', // 发布开始时间
      updateTime: '', // 发布时间
      tabsId: 'explose_user', // 选项卡标识(本次数据)
      cacheTabsId: 'explose_user', // 选项卡标识(上次数据)
      hasPortraitTabs: ['explose_user', 'view_user', 'resources_user_new'], // 需要显示画像数据tab
      dateTime: [], // 时间范围
      timeText: '', // 时间文案
      tabsName: '曝光人数', // 标签标识
      bSearch: false, // 是否已搜索
      search: {
        news_id: this.$route.query.news_id || ''
      }, // 搜索数据
      lineChartData: {}, // 线图数据
      portraitDatas: {}, // 画像数据
      showChart: true, // 显示画像数据
      // tab数据
      tabOptions: [
        {
          label: '曝光人数',
          name: 'explose_user'
        },
        {
          label: '浏览人数',
          name: 'view_user'
        },
        {
          label: '新线索人数',
          name: 'resources_user_new'
        },
        {
          label: '平均浏览时长',
          name: 'avg_view_duration'
        },
        {
          label: '评论量',
          name: 'sum_comment_num'
        },
        {
          label: '点赞量',
          name: 'sum_like_num'
        }
      ],
      // 关键指标数据
      indicatorsData: {
        explose_user: 0, // 曝光人数
        view_user: 0, // 浏览人数
        resources_user_new: 0, // 新线索人数
        avg_view_duration: 0, // 平均浏览时长(min)
        sum_comment_num: 0, // 评论量
        sum_like_num: 0 // 点赞量
      },
      // 线形图配置
      lineChartOptions: {
        xAxis: {
          data: []
        },
        series: {
          data: []
        }
      },
      // 报考年份人数分布
      exam_year: {
        series: {
          data: []
        }
      },
      // 报考专业人数
      major_name: {
        xAxis: {
          data: []
        },
        series: {
          data: []
        }
      },
      // 报考院校人数
      school_name: {
        xAxis: {
          data: []
        },
        series: {
          data: []
        }
      },
      // 院校目标
      school_target: {
        series: {
          data: []
        }
      },
      // 备考状态
      examed_times: {
        series: {
          data: []
        }
      },
      // 当前状态
      condition_state: {
        series: {
          data: []
        }
      },
      totalDatas: 0, // 总数
      maxSelectTime: 30, // 最大可选时间范围
      timeOptionRange: null
    };
  },
  components: {
    LineChart,
    PieChart,
    BarChart,
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
          }
        ]
      };
    },
    // 是否显示画像
    showPortrait() {
      return this.hasPortraitTabs.indexOf(this.tabsId) >= 0;
    }
  },
  methods: {
    // 查看明细
    handleGoLink() {
      this.$router.push({
        path: '/clue/list',
        query: { u: this.uuid, news_uuid: this.news_uuid, obj_name: this.title }
      });
    },
    // 时间切换
    handleDateChange(res) {
      if (res) {
        this.search.user_view_start_time = parseInt(res[0] / 1000);
        this.search.user_view_end_time = parseInt(res[1] / 1000);
      } else {
        this.search.user_view_start_time = '';
        this.search.user_view_end_time = '';
      }
    },
    // 查询
    async handleSearch() {
      if (this.bSearch) return;
      this.bSearch = true;

      // 获取线型数据
      await this.getNewsDetail();
      // 获取画像数据
      this.showPortrait && (await this.getUserPortrait());

      this.bSearch = false;
    },
    // tab切换
    handleTabsClick(res) {
      let { label, name } = res;
      if (this.tabsId == this.cacheTabsId) return;

      this.cacheTabsId = name; // 设置tab标识
      this.tabsName = label; // 设置name

      // 判断是否需要展示画像数据
      if (this.showPortrait) {
        // 是否显示画像
        this.showChart = true;
        // 获取画像数据
        this.getUserPortrait();
      } else {
        // 是否显示画像
        this.showChart = false;
      }
      // 设置线型图表数据
      this.setLineOptions();
    },

    // 设置线图图表数据
    setLineOptions(data = this.lineChartData) {
      let { day } = data;
      this.lineChartOptions.series.name = this.tabsName;
      this.lineChartOptions.xAxis.data = day;
      this.lineChartOptions.series.data = data[this.cacheTabsId];
      this.totalDatas = data[`${this.cacheTabsId}_total`];
    },
    // 设置柱状图数据
    setBarOptions(data) {
      let option = {
        xAxis: {
          data: []
        },
        series: {
          data: []
        }
      };
      data.map((item) => {
        option.xAxis.data.push(item.name);
        option.series.data.push(item.value);
      });
      return option;
    },
    // 设置饼图数据
    setPieOptions(data) {
      let option = {
        series: {
          data: []
        }
      };
      option.series.data = data;
      return option;
    },

    // 获取头部数据
    async getNewsTitle(params = this.search) {
      let { result, status, message } = await api.getNewsTitle(params);
      if (status == 200) {
        let { news_id, news_name, news_pulish_day_timestamp, news_uuid } = result || {};
        let now = Date.now();
        this.title = news_name;
        this.news_uuid = news_uuid;
        this.updateTime = dayjs(new Date(news_pulish_day_timestamp * 1000)).format('YYYY年MM月DD日');
        this.beginTime = news_pulish_day_timestamp;

        // 搜索数据
        this.search = {
          news_id: news_id || this.news_id,
          user_view_start_time: this.beginTime || parseInt((now - 3600 * 30 * 1000) / 1000),
          user_view_end_time: parseInt(now / 1000)
        };

        // 设置默认发布时间
        this.dateTime = [this.beginTime * 1000, now];

        // 搜索数据
        this.handleSearch();
      } else {
        this.$message.error(message);
      }
    },
    // 获取关键指标
    async getNewsOverview(params = this.search) {
      let { result, status, message } = await api.getNewsOverview(params);
      if (status == 200) {
        // 设置关键指标
        this.indicatorsData = result;
      } else {
        this.$message.error(message);
      }
    },
    // 获取关键指标图表(线图)
    async getNewsDetail(params = this.search) {
      let { result, status, message } = await api.getNewsDetail(params);
      if (status == 200) {
        // 设置线图数据
        this.lineChartData = result;
        // 设置线型图表数据
        this.setLineOptions();
      } else {
        this.$message.error(message);
      }
    },
    // 获取画像数据(饼图,柱状图)
    async getUserPortrait() {
      let params = { ...this.search, type: this.tabsId };
      let { result, status, message } = await api.getUserPortrait(params);
      if (status == 200) {
        let { exam_year, major_name, school_name, school_target, examed_times, condition_state } = result;

        // 设置报考年份人数数据
        this.exam_year = this.setPieOptions(exam_year);
        // 设置报考专业人数
        this.major_name = this.setBarOptions(major_name);
        // 报考院校人数
        this.school_name = this.setBarOptions(school_name);
        // 院校目标
        this.school_target = this.setPieOptions(school_target);
        // 备考状态
        this.examed_times = this.setPieOptions(examed_times);
        // 当前状态
        this.condition_state = this.setPieOptions(condition_state);

        // 设置时间文案
        if (this.dateTime && this.dateTime[0]) {
          let startTime = dayjs(new Date(this.dateTime[0])).format('YYYY-MM-DD');
          let endTime = dayjs(new Date(this.dateTime[1])).format('YYYY-MM-DD');
          this.timeText = `${startTime} ~ ${endTime}`;
        } else {
          this.timeText = '';
        }
      } else {
        this.$message.error(message);
      }
    }
  },
  async created() {
    thisVue = this;

    // 获取顶部信息数据
    await this.getNewsTitle();
    // 获取关键指标
    await this.getNewsOverview();
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

.detail {
  padding: 30px;
  box-sizing: border-box;
  background: #fff;

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
    margin-bottom: 24px;

    &-text {
      font-size: 20px;
      line-height: 30px;
      color: #333;
      font-weight: bold;
      margin-bottom: 4px;
    }

    &-date {
      font-size: 14px;
      line-height: 20px;
      color: #7f7f7f;
    }
  }

  /* 栏目标题 */
  &_indicators {
    margin-bottom: 8px;
  }

  /* 指标 */
  &_box {
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

      &-link {
        color: $defaultColor;
        line-height: 24px;
        margin-top: 6px;
        display: inline-block;
        cursor: pointer;

        &-icon {
          width: 0px;
        }
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
      padding-bottom: 20px;

      &-title {
        padding-top: 14px;
        margin-bottom: 4px;

        &-text {
          margin-left: 24px;
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

      &-datas {
        height: 40px;
        line-height: 40px;
        margin: 0 24px;
        padding: 0 16px;
        background: #f7fcfd;
        color: #666;
        margin-bottom: 12px;
      }

      &-comp {
        box-sizing: border-box;
        position: relative;

        &.line-chart {
          padding: 10px;
          height: 330px;
        }

        &.pie-chart {
          height: 280px;
        }
      }

      /* 图表 */
      &-portrait {
        margin-top: 24px;
        padding: 0 24px;

        &-title {
          margin-bottom: 14px;
        }

        &-cont {
          @extend .clearfix;
        }

        &-item {
          width: 49%;
          min-width: 400px;
          height: 400px;
          float: left;
          margin-bottom: 24px;
          box-sizing: border-box;
          border: 1px solid $borderColor;
          padding: 20px;

          &:nth-child(even) {
            float: right;
          }
        }
      }
    }
  }
}
</style>
