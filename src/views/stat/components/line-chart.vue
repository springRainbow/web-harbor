<template>
  <div class="chart">
    <div class="default" v-if="!hasData"><span>暂无数据</span></div>
    <div class="line-chart" ref="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
]);

export default {
  name: 'lineChart',
  props: {
    options: Object,
    xRotate: Boolean
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
          this.init();
        });

        return val;
      },
      deep: true,
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
        this.option.grid.bottom = '20%';
      },
      immediate: true
    }
  },
  computed: {
    option() {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '5%',
          left: '7%',
          right: '5%',
          bottom: '20%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: {
          type: 'line',
          areaStyle: {
            color: '#04C160',
            opacity: 0.1
          },
          lineStyle: {
            color: '#04C160'
          },
          itemStyle: {
            color: '#04C160'
          },
          data: []
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
      /* console.log(this.chart, document.getElementById('pie-chart'));
      this.chart = this.chart ? this.chart : echarts.init(document.getElementById('pie-chart'));
      this.chart.setOption(this.option); */
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
    z-index: 1;

    span {
      font-size: 30px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .line-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
