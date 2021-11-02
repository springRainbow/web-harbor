<template>
  <div class="item-box" v-show="uploading">
    <oss-upload
      :options="fileOptions"
      @uploadSuccess="uploadSuccess"
      @uploadFailed="uploadFailed"
      @uploadError="uploadError"
      ref="fileElement"
    >
      <template slot-scope="props">
        <div class="z-item upload-btn" :class="{ 'dialog-class': isDialog }" v-if="!imageLoadingFail">
          <div class="video-uploading">
            <el-progress
              :percentage="props.files.length ? props.files[0].uploadPercent : 0"
              :stroke-width="8"
              :show-text="false"
              :style="{ width: isDialog ? '110px' : '150px', 'margin-top': isDialog ? '64px' : '88px' }"
              style="margin-left: 20px"
            ></el-progress>
            <p style="margin-top: 20px">上传中…</p>
          </div>
        </div>
        <div v-else class="z-item">
          <img src="~@/assets/image-loading-fail.png" class="image-class" style="width: 84px" />
        </div>
        <div class="upload-content-time">
          <p class="p-left">{{ uploadData.show_name }}</p>
          <p class="p-right" v-if="!isDialog">{{ uploadData.show_name ? getToday() : '' }}</p>
        </div>
      </template>
    </oss-upload>

    <input
      type="file"
      accept="image/jpg,image/jpeg,image/png"
      ref="uploadRef"
      @change="handleFileChange"
      v-show="false"
    />
  </div>
</template>
<script>
import api from '../../../_api';

export default {
  data() {
    return {
      url: '',
      fileOptions: {
        parameters: {
          authkey: '',
          product_line: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp',
          space: 'kmf-image',
          subject: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp'
        },
        multiple: false,
        maxLength: 1,
        overReplace: true,
        fileList: []
      },
      uploadData: {
        name: '',
        show_name: '',
        path: '',
        width: '',
        height: '',
        uid: localStorage.getItem('HARBOR_ID'),
        type: '0'
      },
      uploading: false,
      imageLoadingFail: false
    };
  },
  watch: {},
  props: {
    isDialog: Boolean //是不是弹框
  },
  components: {},
  computed: {},
  methods: {
    //触发文件上传的change事件调用组件方法
    handleFileChange(e) {
      let _this = this;
      const file = e.target.files[0],
        size = e.target.files[0].size;

      if (size > 10485760 || size < 5120) {
        this.$message({
          message: '剪切后图片大小不在5K～10M范围内，请重新调整。',
          type: 'error',
          customClass: 'zZindex'
        });
        this.uploading = false;
        this.$refs.uploadRef.value = '';
        return false;
      } else if (size < 5242880) {
        this.uploadData.show_name = e.target.files[0].name;
        this.$refs.fileElement.handleFileChange(e);
      } else {
        let rate = 0.4;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let img = new Image();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        img.onload = function () {
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          // 缩放比例，默认0.5
          let targetW = (canvas.width = this.width * rate);
          let targetH = (canvas.height = this.height * rate);
          context.clearRect(0, 0, targetW, targetH);
          context.drawImage(img, 0, 0, targetW, targetH);
          const newImage = canvas.toDataURL('image/jpg');
          _this.$refs.fileElement.base64Upload(newImage, _this.uploadData.show_name);
        };
      }

      this.uploading = true;
    },

    // 上传成功
    async uploadSuccess(res) {
      console.log(res);
      let { status } = await api.saveImage(
        Object.assign(this.uploadData, {
          path: res.result.full_url,
          name: res.result.file,
          width: res.width,
          height: res.height
        })
      );
      if (status == 200) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.uploading = false;
        this.$emit('uploadSuccess', 'image');
        this.$refs.uploadRef.value = '';
      }
    },
    // 上传失败
    uploadFailed(err) {
      console.log(err);
      this.$QzMessage({
        content: '当前网络环境较差，上传图片失败'
      });
      this.imageLoadingFail = true;
    },
    uploadError(err) {
      this.$message({
        message: err.msg,
        type: 'warning'
      });
      this.uploading = false;
    },
    closeDel() {
      this.$emit('closeDel');
    },
    uploadMaterial() {
      this.$refs.uploadRef.dispatchEvent(new MouseEvent('click'));
    },
    getToday() {
      let date = new Date();
      return `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()}-${date.getDate().toString()} `;
    }
  }
};
</script>
<style scoped lang="scss">
@import './material.scss';

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
  p {
    color: rgba(0, 0, 0, 0.4);
    font-size: 14px;
    line-height: 14px;
  }
}
.dialog-class {
  width: 150px !important;
  height: 150px !important;
}
</style>
<style>
.zZindex {
  z-index: 30000 !important;
}
</style>
