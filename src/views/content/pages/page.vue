<template>
  <div>
    业务内的页面
    <el-button @click="showDrawer = true">评论列表</el-button>
    <com-comment v-model="showDrawer" />
  </div>
</template>
<script>
import ComComment from '@/components/Comment/index';
export default {
  name: '',
  components: { ComComment },
  data() {
    return {
      showDrawer: false
    };
  }
};
</script>
<style lang="scss" scpoed></style>
