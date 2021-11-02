<!--
*
* 素材库视频弹框
*
-->
<template>
  <el-dialog :title="`选择视频素材`" :show-close="true" @close="cancal" :visible.sync="dialogVisible">
    <div style="padding: 20px 22px 20px 40px">
      <VideoList
        :list="list"
        :total="total"
        :isDialog="true"
        ref="VideoList"
        @getMediaList="uploadSuccess"
        @refresh="refresh"
        @selectMaterial="selectMaterial"
      />
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="page"
      :total="total"
      :page-size="20"
      @current-change="handleCurrentChange"
      hide-on-single-page
      style="text-align: right; margin-right: 20px"
    >
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" plain @click="cancal">取 消</el-button>
      <el-button type="primary" @click="submit()" :disabled="!current" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '../../../_api';
import VideoUpload from '../../material/components/VideoUpload';
import VideoList from '../../material/components/VideoList';
export default {
  name: 'videoDialog',
  data() {
    return {
      dialogVisible: false,
      currentInfo: {},
      current: 0,
      page: 1,
      total: 0,
      uploading: true,
      list: [],
      file_name: ''
    };
  },
  components: {
    VideoUpload,
    VideoList
  },
  created() {},
  props: {},
  computed: {},
  methods: {
    showMaterialDialog() {
      this.currentInfo = {};
      this.current = 0;
      this.getMediaList();
      this.dialogVisible = true;
    },
    handleClick() {
      this.page = 1;
      this.getMediaList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMediaList();
    },
    async getMediaList() {
      let { result } = await api.getMediaList({ type: 1, page: this.page, file_name: this.file_name });
      this.list = result.list;
      this.total = result.count;
    },
    submit() {
      if (!this.currentInfo.file_path) {
        this.$message.error('请选择素材！');
        return false;
      }
      this.$emit('submitSucceed', {
        info: this.currentInfo,
        type: 'video'
      });
      this.dialogVisible = false;
      this.$refs.VideoList.clearSearch();
    },
    uploadSuccess() {
      this.getMediaList();
      //隔10秒请求一下，看看有没有获取到截图，没有就算了
      let _this = this;
      setTimeout(() => {
        _this.getMediaList();
      }, 10000);
    },
    selectMaterial(item) {
      // if (item.state !== 2 && item.transcode_state === 2) {
      this.currentInfo = item;
      this.current = item.id;
      // }
    },
    refresh(file_name) {
      this.file_name = file_name;
      this.getMediaList(file_name);
    },
    cancal() {
      this.dialogVisible = false;
      this.$refs.VideoList.clearSearch();
    }
  },
  watch: {
    current(id) {
      this.list.forEach((element) => {
        if (id == element.id) {
          this.currentInfo = element;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__header {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
  padding-left: 40px;
  // border-bottom: 1px solid #ebebeb;
}
/deep/ .el-dialog {
  width: 1020px;
}
/deep/ .el-dialog__body {
  padding: 0;
  height: 620px;
  overflow: auto;
}
/deep/ .el-dialog__footer {
  text-align: center;
}
</style>
