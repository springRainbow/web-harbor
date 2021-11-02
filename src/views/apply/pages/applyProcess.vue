<template>
  <div class="process">
    <div class="process-step g-clearfix">
      <h3 class="process-step_tit fl">机构号</h3>
      <ul class="fr process-step_part">
        <li :class="{ active: curStep <= 3 }">阅读服务协议</li>
        <li class="process-step_arrow" :class="{ active: curStep >= 2 }"></li>
        <li :class="{ active: curStep >= 2 }">填写资料</li>
        <li class="process-step_arrow" :class="{ active: curStep == 3 }"></li>
        <li :class="{ active: curStep == 3 }">提交审核</li>
      </ul>
    </div>
    <el-alert v-if="$route.query.u" class="refuse-tips" :title="refuse" type="warning" show-icon :closable="false">
    </el-alert>
    <div class="process-step_comp">
      <component :is="currentStep" @nextStep="nextStep" @editData="editInfo"></component>
    </div>
  </div>
</template>
<script>
const step1 = () => import(/* webpackChunkName:'apply' */ './step/step-1');
const step2 = () => import(/* webpackChunkName:'apply' */ './step/step-2');
export default {
  name: 'applyProcess',
  data() {
    return {
      curStep: 1,
      refuse: ''
    };
  },
  computed: {
    currentStep() {
      const stepComp = {
        1: step1,
        2: step2,
        3: step2
      };
      return stepComp[this.curStep];
    }
  },
  watch: {
    $route(value) {
      this.curStep = value.params.step;
    }
  },
  created() {
    this.curStep = this.$route.params.step;
  },
  methods: {
    nextStep(data) {
      if (data == 0) {
        this.$router.push({
          name: 'apply'
        });
      } else {
        this.$router.push({
          name: 'applyProcess',
          params: {
            step: data
          },
          query: {
            type: this.$route.query.type
          }
        });
      }
    },
    editInfo(data) {
      this.refuse = (data.audit && data.audit.remark) || '暂无拒绝理由';
    }
  }
};
</script>
<style lang="scss">
.process {
  .agree {
    color: rgba(0, 0, 0, 0.4);
    padding-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss" scoped>
.process {
  .refuse-tips {
    margin-bottom: 20px;
    background: rgba(255, 249, 237, 1);
    border-radius: 4px;
    border: 1px solid rgba(252, 206, 114, 1);

    /deep/.el-alert__title {
      color: rgba(250, 173, 20, 1);
      font-size: 14px;
    }
  }
  &-step {
    width: 100%;
    height: 64px;
    line-height: 64px;
    background: #fff;
    box-sizing: border-box;
    padding: 0 32px;
    margin-bottom: 20px;
    &_tit {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.8);
      font-weight: normal;
    }
    &_part {
      li {
        float: left;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.4);
        &.active {
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
    &_arrow {
      width: 54px;
      margin: 0 8px;
      height: 40px;
      background: url('~@/assets/icon-process-arrow.png') no-repeat;
      background-size: contain;
      position: relative;
      top: 26px;
      &.active {
        background: url('~@/assets/icon-process-arrow-active.png') no-repeat;
        background-size: contain;
      }
    }
    &_comp {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 0 32px 0;
      background: #fff;
    }
  }
}
</style>
