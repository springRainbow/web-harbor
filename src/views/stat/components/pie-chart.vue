<template>
  <div class="chart">
    <div class="default" v-if="!hasData"><span>暂无数据</span></div>
    <div class="pie-chart" ref="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

export default {
  name: 'pieChart',
  props: {
    options: Object, // 数据
    // 饼图 or 环形图
    type: {
      type: String,
      default: 'circular'
    },
    unit: String, // 单位
    title: String, // 标题
    percentage: Boolean // 是否显示百分比
  },

  data() {
    return {
      chart: null,
      hasData: true
    };
  },
  watch: {
    options: {
      handler(val) {
        if (!val) return;
        let { series } = val;
        // 合并数据 & 初始化图表
        this.$nextTick(() => {
          this.option.series = { ...this.option.series, ...series };
          this.hasData = this.option.series.data[0] !== undefined;
          this.init();
        });

        return val;
      },
      deep: true,
      immediate: true
    },
    // 类型
    type: {
      handler(val) {
        if (!val) return;
        // 圆形
        if (val == 'circular') {
          this.option.series.radius = '60%';
        }
        // 环形
        if (val == 'ring') {
          this.option.series.radius = ['40%', '80%'];
        }
      },
      immediate: true
    },
    // 标题
    title: {
      handler(val) {
        if (!val) return;
        this.option.series.top = '10%';
        this.option.series.name = val;
        this.option.title = {
          text: val,
          left: 'center',
          top: '0%'
        };
      },
      immediate: true
    }
  },
  components: {},
  computed: {
    option() {
      return {
        /* tooltip: {
          trigger: 'item'
        }, */
        // 筛选图标
        legend: {
          bottom: '0%',
          left: 'center'
        },
        // 饼图颜色
        color: ['#00DEE7', '#FFD313', '#3784FF', '#959595', '#5AD677', '#ED7E31', '#5B9BD5'],
        // 渲染数据
        series: {
          name: '',
          type: 'pie',
          radius: '50%',
          top: '0%',
          bottom: '10%',
          avoidLabelOverlap: false,
          labelLine: {
            show: true
          },
          label: {
            show: true,
            formatter: `{b}: {c}${this.unit ? this.unit : ''}${this.percentage ? '({d}%)' : ''}`
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold' /* ,
              fontSize: 14 */
            },
            itemStyle: {
              shadowBlur: 4,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: []
        }
      };
    }
  },
  methods: {
    init() {
      if (this.chart) {
        this.chart.setOption(this.option);
      } else {
        this.chart = echarts.init(this.$refs.chart);
        this.chart.setOption(this.option);
      }
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  position: relative;

  .default {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    color: #4bdae4;
    background: #f7fcfd;

    span {
      font-size: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .pie-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
