<!--
*
* 图片选择裁剪
*
-->
<template>
  <div class="upload-main" v-if="showImageUpload">
    <div class="upload-main-box">
      <div class="upload-title">
        选择图片
        <img class="upload-title-close-btn" src="~@//assets/close.png" alt="" @click="closeDialog" />
      </div>
      <div class="upload-opt">
        <div class="upload-opt-left">
          <div class="upload-opt-left-cjq">
            <vue-cropper ref="cropper" v-bind="option" @realTime="realTime" @imgLoad="imgLoad" v-if="show">
            </vue-cropper>
            <div></div>
          </div>
          <div class="image-op">
            <!-- <i class="qz-icon el-icon-circle-plus-outline" @click="changeScale(1)"></i> -->
            <!-- <i class="qz-icon el-icon-remove-outline" @click="changeScale(-1)"></i> -->
            <i class="qz-icon el-icon-refresh-right" @click="rotateRight"><span class="rotate-right">旋转图片</span></i>
          </div>
        </div>
        <div class="upload-opt-right">
          <span class="text-title">封面预览：</span>
          <div class="show-preview" :style="previewSize">
            <img :src="previews" />
          </div>
          <div class="screenshot-size">
            <div class="screenshot-size-flex-left">裁剪尺寸：</div>
            <div class="screenshot-size-flex-right">
              <el-radio-group v-model="screenshotSize">
                <el-radio :label="1" v-if="info_type == 0">方形 1:1</el-radio><br />
                <el-radio :label="10" v-if="info_type == 1">横版 16:10 </el-radio><br />
                <el-radio :label="9">竖版 9:16</el-radio><br />
                <el-radio :label="10" v-if="info_type == 0">横版 16:10 </el-radio><br />
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center">
        <el-button type="primary" style="padding: 7px 30px; margin-right: 24px" @click="closeDialog()"
          >上一步</el-button
        >
        <el-button type="primary" style="padding: 7px 30px" @click="uploadImg()" :loading="loading">完 成</el-button>
      </div>

      <oss-upload
        :options="fileOptions"
        @uploadSuccess="uploadSuccess"
        @uploadFailed="uploadFailed"
        @uploadError="uploadError"
        ref="filesEle"
        v-show="false"
      >
      </oss-upload>
    </div>
  </div>
</template>
<script>
import api from '../../../_api';

import { VueCropper } from 'vue-cropper';
export default {
  data() {
    return {
      url: '',
      previews: {},
      previewSize: {},
      showImageUpload: false,
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
      option: {
        img: '', //裁剪图片的地址
        outputSize: 0.5, //裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg', //裁剪生成图片的格式（jpeg || png || webp）
        // info: true, //图片大小信息
        canScale: true, //图片是否允许滚轮缩放
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: '230', //默认生成截图框宽度
        autoCropHeight: '230', //默认生成截图框高度
        fixed: true, //是否开启截图框宽高固定比例
        fixedNumber: [1, 1], //截图框的宽高比例
        full: true, //false按原比例裁切图片，不失真
        fixedBox: false, //固定截图框大小，不允许改变
        canMove: true, //上传图片是否可以移动
        canMoveBox: true, //截图框能否拖动
        original: false, //上传图片按照原始比例渲染
        centerBox: true, //截图框是否被限制在图片里面
        height: false, //是否按照设备的dpr 输出等比例图片
        // infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000, //限制图片最大宽度和高度
        enlarge: 1, //图片根据截图框输出比例倍数
        mode: '100% auto' //图片默认渲染方式
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
      loading: false,
      show: true,
      info_type: 0,
      screenshotSize: 1
    };
  },
  watch: {
    screenshotSize(newVal) {
      this.show = false;
      this.previewSize = this.getPreviewSize();
      this.$nextTick(() => {
        switch (newVal) {
          case 1:
            this.option.autoCropWidth = 230;
            this.option.autoCropHeight = 230;
            this.option.fixedNumber = [1, 1];
            break;
          case 9:
            this.option.autoCropWidth = 90;
            this.option.autoCropHeight = 160;
            this.option.fixedNumber = [9, 16];
            break;
          case 10:
            this.option.autoCropWidth = 320;
            this.option.autoCropHeight = 200;
            this.option.fixedNumber = [16, 10];
            break;
        }
        this.show = true;
      });
    },
    showImageUpload(value) {
      this.$emit('uploadDialogShow', value);
    },
    info_type: {
      immediate: true,
      handler: function (type) {
        if (type == 0) {
          this.screenshotSize = 1;
        } else {
          this.screenshotSize = 10;
        }
      }
    }
  },
  components: {
    VueCropper
  },
  computed: {},
  methods: {
    getPreviewSize() {
      switch (this.screenshotSize) {
        case 1:
          return { width: '290px', height: '290px' };
        case 9:
          return { width: '180px', height: '320px' };
        case 10:
          return { width: '320px', height: '200px' };
      }
    },
    // 设置头像base64
    setAvatarBase64(src, callback) {
      let _this = this;
      let image = new Image();
      // 处理缓存
      image.src = src + '?v=' + Math.random();
      // 支持跨域图片
      image.crossOrigin = 'Anonymous';
      image.onload = function () {
        let base64 = _this.transBase64FromImage(image);
        callback && callback(base64);
      };
    },
    // 将网络图片转换成base64格式
    transBase64FromImage(image) {
      let canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      // 可选其他值 image/jpeg
      return canvas.toDataURL('image/jpg');
    },
    init(url, name) {
      this.setAvatarBase64(`//image.kmf.com/${url}`, this.initCropper);
      this.uploadData.show_name = name;
    },
    initCropper(base64) {
      this.option.img = base64;
      this.showImageUpload = true;
    },
    //初始化函数
    imgLoad(msg) {
      console.log('工具初始化函数=====' + msg);
    },
    //图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    //向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    //向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    //实时预览函数
    realTime() {
      this.$refs.cropper.getCropData(async (data) => {
        this.previews = data;
      });
    },
    //上传图片
    uploadImg() {
      this.loading = true;
      let _this = this;
      //获取截图的blob数据
      this.$refs.cropper.getCropData(async (data) => {
        console.log(data);
        let size = 0;
        const equalIndex = data.indexOf('='); // 获取=号下标
        if (equalIndex > 0) {
          const str = data.substring(0, equalIndex); // 去除=号
          const strLength = str.length;
          const fileLength = strLength - (strLength / 8) * 2; // 真实的图片byte大小
          size = Math.floor(fileLength); // 向下取整
        } else {
          const strLength = data.length;
          const fileLength = strLength - (strLength / 8) * 2;
          size = Math.floor(fileLength); // 向下取整
        }
        _this.$refs.filesEle.base64Upload(data, this.uploadData.show_name);
      });
    },
    // 上传成功
    async uploadSuccess(res) {
      let { status } = await api.saveImage(
        Object.assign(this.uploadData, {
          path: res.result.full_url,
          name: res.result.file,
          width: res.width,
          height: res.height,
          group: 1 //代表封面
        })
      );
      if (status == 200) {
        this.$emit('imageCropperSuccess', { path: res.src });
        this.loading = false;
        this.showImageUpload = false;
      }
    },
    // 上传失败
    uploadFailed(err) {
      console.log(err);
      this.$QzMessage({
        content: '当前网络环境较差，添加封面失败'
      });
      this.loading = false;
    },
    uploadError(err) {
      this.$message({
        message: err.msg,
        type: 'warning'
      });
      this.loading = false;
    },
    closeDialog() {
      this.loading = false;
      this.showImageUpload = false;
    }
  },
  created() {
    const info_type = this.$route.query.info_type;
    this.info_type = info_type;
  }
};
</script>
<style scoped lang="scss">
.upload-main {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 2099;
}
.upload-main-box {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  padding: 24px;
  width: 1150px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.02), 0px 8px 28px 0px rgba(0, 0, 0, 0.04),
    0px 6px 16px -8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  .upload-title {
    height: 26px;
    position: relative;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(235, 235, 235, 1);
    color: rgba(0, 0, 0, 0.8);
    font-weight: bold;
    font-size: 16px;
    &-close-btn {
      width: 16px;
      position: absolute;
      top: -12px;
      right: -12px;
    }
  }
  .upload-opt {
    display: flex;
    padding-top: 20px;
    &-left {
      flex: 55;
      // width: 340px;
      padding: 50px 80px 60px 140px;
      &-cjq {
        padding-top: 8px;
        width: 410px;
        height: 410px;
      }
    }
    &-right {
      flex: 45;
      padding: 50px 140px 60px 80px;
    }
  }
  .text-title {
    height: 26px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 26px;
  }
}

.show-preview {
  overflow: hidden;
  margin-bottom: 14px;
  width: 290px;
  height: 290px;
  img {
    width: 100%;
    height: 100%;
  }
  .preview {
    overflow: hidden;
    border-radius: 4px;
  }
}
.image-op {
  padding: 8px;
  width: 260px;
  box-sizing: border-box;
  .qz-icon {
    color: rgba(21, 207, 220, 1);
    font-size: 20px;
    margin-right: 16px;
  }
}
.rotate-right {
  font-size: 14px;
  line-height: 20px;
  display: inline-block;
  position: relative;
  top: -2px;
}
.screenshot-size {
  display: flex;
  margin-top: 24px;
  &-flex-left {
    width: 70px;
    height: 26px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 26px;
  }
  &-flex-right {
    flex: 1;
    .el-radio {
      margin-bottom: 14px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 8px;
      span {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>
