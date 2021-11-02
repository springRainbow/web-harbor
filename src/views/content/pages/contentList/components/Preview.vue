<template>
  <!--
*
* iframe嵌套内容详情页，展示预览
*
-->
  <el-dialog title="预览" :visible.sync="show" width="750px">
    <iframe
      :src="url"
      style="height:600px;width:720px;frameborder=no"
      frameborder="no"
      border="0"
      marginWidth="0"
      marginHeight="0"
    ></iframe>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      uuid: '',
      show: false,
      type: '' //previe或者draft
    };
  },
  components: {},
  props: {},
  created() {},
  computed: {
    url() {
      let url = `https://${process.env.NODE_ENV == 'production' ? '' : 'test-'}harbor.qz100.com/a/?id=${
        this.uuid
      }&type=${this.type}`;
      if (this.type == 'publish') url += `&innerkey=${localStorage.getItem('HARBOR_ID')}`;
      return url;
    }
  },
  methods: {
    showPreview(uuid, type) {
      this.uuid = uuid;
      this.show = true;
      this.type = type;
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped></style>
