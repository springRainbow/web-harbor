<template>
  <el-alert
    v-if="!alertStatus"
    :title="title"
    :type="type"
    :center="center"
    class="alert"
    :closable="closable"
    :close-text="closeText"
    :show-icon="showIcon"
    :description="description"
    @close="handleCloseAlert"
  >
  </el-alert>
</template>

<script>
export default {
  name: 'alertTip',
  props: {
    title: String,
    description: String,
    id: {
      type: [String, Number, Boolean],
      default: ''
    },
    closable: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'warning'
    },
    center: Boolean,
    closeText: String,
    showIcon: Boolean,
    effect: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    alertStatus() {
      return this.$cookie.get(`tip_${this.id}`);
    }
  },
  methods: {
    // 关闭顶部提示
    handleCloseAlert() {
      this.$cookie.set(`tip_${this.id}`, 1, {
        expires: 31,
        domain: '.qz100.com'
      });
      this.$emit('close', this.id);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped lang="scss">
.alert {
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
</style>
