<template>
  <div class="echojoy-message">
    <p>
      {{ content }}
    </p>
  </div>
</template>

<script>
// 主要就改了 data
export default {
  name: 'EchojoyMessage',
  data() {
    return {
      content: '',
      duration: 2000
    };
  },
  mounted() {
    setTimeout(() => {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }, this.duration);
  }
};
</script>

<style lang="scss" scoped>
.echojoy-message {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  z-index: 9999;
  background: transparent;
  > p {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    padding: 17px 24px;
    height: 22px;
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
    min-width: 160px;
    text-align: center;
  }
}
</style>
