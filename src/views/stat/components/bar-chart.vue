<template>
  <div class="chart">
    <div class="default" v-if="!hasData"><span>暂无数据</span></div>
    <div class="bar-chart" ref="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

export default {
  name: 'barChart',
  props: {
    options: Object,
    title: String, // 标题
    xRotate: Boolean // x轴文字倾斜
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
        let { xAxis, series } = val;

        // 合并数据 & 初始化图表
        this.$nextTick(() => {
          this.option.xAxis = { ...this.option.xAxis, ...xAxis };
          this.option.series = { ...this.option.series, ...series };

          this.hasData = this.option.series.data[0] !== undefined;
          //console.log('this.option.series', this.option.series.data);
          this.init();
        });

        return val;
      },
      deep: true,
      immediate: true
    },
    // 标题
    title: {
      handler(val) {
        if (!val) return;
        this.option.grid.top = '20%';
        this.option.series.name = val;
        this.option.title = {
          text: val,
          left: 'center',
          top: '0%'
        };
      },
      immediate: true
    },
    // 文字倾斜
    xRotate: {
      handler(val) {
        if (!val) return;
        this.option.xAxis.axisLabel = {
          interval: 0,
          rotate: 46
        };
      },
      immediate: true
    }
  },
  computed: {
    option() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: {
          name: '',
          type: 'bar',
          top: 0,
          barWidth: '60%',
          data: [],
          itemStyle: {
            color: '#B9EEF2'
          }
        }
      };
    }
  },
  methods: {
    // 初始化图表
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

  .bar-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
