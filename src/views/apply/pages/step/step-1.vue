<template>
  <div class="step-1">
    <!-- <h3 class="step-1_tit">轻舟号服务协议</h3> -->
    <vue-scroll :style="{ height: `${clientHeight - 320}px` }">
      <div class="step-1_text" v-html="agreement"></div>
    </vue-scroll>
    <el-checkbox class="agree" v-model="isagree">已阅读并同意《轻舟机构号服务协议》</el-checkbox>
    <div>
      <el-button plain @click="nextStep('0')">上一步</el-button>
      <el-button type="primary" :disabled="!isagree" @click="nextStep('2')">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'Step1',
  data() {
    return {
      isagree: false,
      agreement: ''
    };
  },
  watch: {
    isagree(value) {
      if (value) {
        sessionStorage.setItem('clickAgree', true);
      } else {
        sessionStorage.removeItem('clickAgree');
      }
    }
  },
  computed: {
    ...mapState({
      clientHeight: (state) => state.common.clientHeight
    })
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('agreement'))) {
      this.agreement = JSON.parse(sessionStorage.getItem('agreement')).service;
    } else {
      this.$router.push({
        name: 'TenantList'
      });
    }
  },
  methods: {
    nextStep(step) {
      if (step == 0) {
        sessionStorage.removeItem('agreement');
      }
      this.$emit('nextStep', step);
    }
  }
};
</script>
<style lang="scss" scoped>
.step-1 {
  padding: 0 80px;
  &_text {
    margin-top: 24px;
    margin-bottom: 32px;
    overflow-y: auto;
  }
  &_tit {
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 16px;
  }
}
</style>
