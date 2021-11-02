<template>
  <div class="content-all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="图片素材" name="0"></el-tab-pane>
      <el-tab-pane label="视频素材" name="1"></el-tab-pane>
    </el-tabs>
    <div>
      <component
        ref="material"
        :is="!+activeName ? 'ImageList' : 'VideoList'"
        :list="list"
        :total="total"
        @getMediaList="uploadSuccess"
        @deleteSuccess="deleteSuccess"
        @refresh="refresh"
      ></component>
    </div>
    <el-pagination
      background
      class="fr g-clearfix page-setting"
      layout="prev, pager, next,jumper"
      :current-page="page"
      :total="total"
      :page-size="20"
      @current-change="handleCurrentChange"
      hide-on-single-page
      v-if="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import api from '../../_api';
import ImageList from './components/ImageList';
import VideoList from './components/VideoList';

export default {
  name: 'material',

  data() {
    return {
      activeName: '0',
      list: [],
      page: 1,
      total: 0,
      file_name: '' //视频列表搜索需要，我也不想这样写，需求方案一直改
    };
  },
  components: {
    ImageList,
    VideoList
  },
  created() {
    this.getMediaList();
  },
  computed: {},
  methods: {
    handleClick() {
      this.page = 1;
      this.total = 0;
      this.file_name = '';
      this.getMediaList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMediaList();
      this.$refs.material.reset(); //重置和删除有关的数据
    },
    async getMediaList() {
      this.list = [];
      let { result } = await api.getMediaList({ type: this.activeName, page: this.page, file_name: this.file_name });
      this.list = result.list;
      this.total = result.count;
    },
    uploadSuccess() {
      this.getMediaList();
      //隔10秒请求一下，看看有没有获取到截图,图片有没有获取到审核结果，没有就算了
      let _this = this;
      console.log(10);
      setTimeout(() => {
        console.log('10miao');
        _this.getMediaList();
      }, 10000);
    },
    deleteSuccess(isAll) {
      isAll && (this.page = this.page - 1 > 0 ? this.page - 1 : 1);
      this.getMediaList();
    },
    refresh(file_name) {
      this.file_name = file_name;
      this.getMediaList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import './components/material.scss';
.page-setting {
  margin-top: 50px;
}
</style>
