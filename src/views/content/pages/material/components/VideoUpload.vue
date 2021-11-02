<template>
  <div class="video-upload-p">
    <input type="file" class="hidden-file" @change="upLoad" ref="uploadRef" accept="video/mp4" />
    <div class="video-upload-p-area" v-if="uploading">
      <div class="title-area">
        <div class="title-area-title">
          {{ currentFileName }}
        </div>
        <div class="title-area-tip">
          <img src="~@/assets/icon-tip.png" style="" alt="" />
          正在上传 请勿刷新页面
        </div>
      </div>
      <p class="upload-loaded-total">{{ progressEvent.loaded }}M/{{ progressEvent.total }}M</p>
      <div class="upload-progress">
        <el-progress
          :percentage="progressEvent.percentCompleted"
          :stroke-width="8"
          color=""
          :show-text="false"
        ></el-progress>
      </div>
      <el-button type="text" class="cancel-upload" @click="cancelUpload">取消上传</el-button>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5';
import api from '../../../_api';
import http from '@/utils/http';

export default {
  name: 'material',
  data() {
    return {
      uploadData: {
        type: '200600028',
        username: 'admin',
        filename: '',
        label: 'test',
        filetype: '1',
        appid: 'qzdaxuesheng',
        filename: '',
        filesize: 0,
        from: 1,
        transcoding: 128,
        screenshot: 3,
        usecover: 1,
        examineflag: 2,
        examinetype: '1,3',
        examineautoflag: 1
      },
      uploadUrl: '',
      body: {},
      currentFileName: '',
      uploading: false,
      cancel: null,
      progressEvent: {
        loaded: 0.0,
        total: 0.0,
        percentCompleted: 0
      }
    };
  },
  components: {},
  created() {},
  props: {
    isDialog: Boolean //是不是弹框
  },
  computed: {},
  methods: {
    uploadMaterial() {
      this.$refs.uploadRef.dispatchEvent(new MouseEvent('click'));
    },
    async upLoad(e) {
      this.$emit('videoUploading', true);
      const files = e.target.files;
      if (files[0].size > 2147483648) {
        this.$message.error('视频大小不能超过2G');
        return false;
      }
      this.uploading = true;
      const HARBOR_ID = localStorage.getItem('HARBOR_ID');
      const filename = `${HARBOR_ID}_${md5(files[0].name + new Date())}`;
      const suffix = files[0].name.split('.')[files[0].name.split('.').length - 1];
      this.uploadData.size = files[0].size;
      this.uploadData.filename = `${filename}.${suffix}`;
      this.uploadData.label = `${filename}`;
      this.currentFileName = files[0].name;

      let { result } = await api.getOssUploadInfo(this.uploadData);
      if (result.Body) {
        let uploadUrl = (process.env.NODE_ENV == 'production' ? 'https://' : 'http://') + result.Host;
        let body = result.Body;
        this.submitUpload(uploadUrl, files, body);
      } else {
        this.$message.error('上传失败！');
        console.log('上传失败', res);
        this.$emit('videoUploading', false);
        this.uploading = false;
      }
    },

    async submitUpload(uploadUrl, files, body) {
      let _this = this;

      let data = new FormData();
      for (let i in body) {
        data.append(i, body[i]);
      }
      data.append('file', files[0]);
      const CancelToken = http.axios.CancelToken;

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          _this.progressEvent = {
            loaded: (progressEvent.loaded / 1024 / 1024).toFixed(2),
            total: (progressEvent.total / 1024 / 1024).toFixed(2),
            percentCompleted: percentCompleted
          };
        },
        cancelToken: new CancelToken((cancel) => {
          _this.cancel = cancel;
        })
      };
      // let res = await api.submitUpload(uploadUrl, data, config);
      let axios = http.axios;

      let res = await axios.post(uploadUrl, data, config).catch(function (thrown) {
        // 如果请求被取消则进入该方法判断
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
          _this.$QzMessage({
            content: `视频上传已取消`
          });
        } else {
          // handle error
        }
      });
      console.log(res);
      if (res && !res.Stat) {
        let { status } = await api.saveVideo({
          show_name: this.currentFileName,
          name: this.uploadData.label,
          path: body.key,
          uid: localStorage.getItem('HARBOR_ID')
        });
        console.log(status);
        if (status == 200) {
          this.$emit('uploadSuccess', 'video');
          this.$message.success('上传成功！');
          this.cancel = null;
        }
      }
      this.$emit('videoUploading', false);
      this.uploading = false;
      this.progressEvent = {
        loaded: 0.0,
        total: 0.0,
        percentCompleted: 0
      };
      if (this.isDialog) {
        this.$refs.uploadRef1.value = '';
      } else {
        this.$refs.uploadRef.value = '';
      }
    },
    closeDel() {
      this.$emit('closeDel');
    },
    cancelUpload() {
      let _this = this;
      this.$confirm(`确定取消上传么？`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(async () => {
          if (_this.cancel) {
            _this.cancel('quxiao');
          } else {
            _this.$message({
              message: '已成功上传无法取消',
              type: 'error'
            });
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.item-box {
  /deep/.el-checkbox__label {
    padding-left: 0;
  }
  .upload-content-time {
    display: flex;
    height: 18px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.3);
    line-height: 18px;
    margin-top: 8px;
    .p-left {
      width: 50px;
      text-align: left;
    }
    .p-right {
      flex: 1;
      text-align: right;
    }
  }
}
.z-item {
  position: relative;
  width: 190px;
  height: 190px;
  line-height: 190px;
  text-align: center;
  border-radius: 4px;
  display: inline-block;
  &.upload-btn {
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed rgba(204, 204, 204, 1);
    position: relative;
  }
}
.hidden-file {
  opacity: 0;
  width: 0;
  height: 0;
  position: fixed;
}
.hidden-file1 {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: relative;
  z-index: 100;
}
.add-pic {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 40px;
  z-index: 10;
}

.upload-text {
  display: inline-block;
  transform: translate(-50%, -50%);
  position: absolute;
  left: 50%;
  top: 20%;
  height: 18px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.2);
}

.video-uploading {
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  z-index: 1000;
  img {
    width: 100px;
    height: 100px;
  }
  p {
    color: #abc;
    font-size: 14px;
    font-weight: bold;
    line-height: 14px;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 70%;
    width: 100%;
  }
}
.video-upload-p {
  position: relative;
  &-area {
    padding: 12px 12px 16px;
    border-bottom: 1px solid #ebebeb;
  }
  .title-area {
    display: flex;
    &-title {
      flex: 1;
    }
    &-tip {
      width: 170px;
      font-size: 12px;
      color: #faad14;
      line-height: 20px;
      background: #fff9ed;
      border-radius: 4px;
      img {
        padding: 6px 2px 6px 8px;
        width: 16px;
        vertical-align: middle;
      }
    }
  }
  .upload-progress {
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
    margin: 12px 0 -14px;
    width: 80%;
  }
  .cancel-upload {
    position: absolute;
    right: 16px;
    bottom: 0px;
  }
  .upload-loaded-total {
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
  }
}
</style>
