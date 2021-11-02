<template>
  <div>
    <oss-upload
      style="margin-top: -16px"
      :options="ossOpt"
      @uploadSuccess="uploadSuccess($event, uploadType)"
      @uploadFailed="uploadFailed"
      @uploadError="uploadError"
      @file-delete="deleteUploadFile($event, uploadType)"
      ref="filesEle"
    >
      <template slot-scope="props">
        <div class="upload-con">
          <div
            class="image-con my-uplaod-image"
            :class="{ 'change-image': list }"
            v-for="(file, key) in props.files"
            :key="key"
          >
            <img
              v-if="file.src"
              @click.stop="previewImg(file.src)"
              class="image-avatar"
              :class="{ myradius: list }"
              :src="file.src"
              alt=""
            />
            <span v-if="!list" class="del-image" @click="props.removeFile(key)"></span>
          </div>
          <span class="edit-upload-image" v-if="list" @click="triggerFileInput">修改</span>
          <div class="upload-img" v-if="!list"></div>
          <div class="upload-area" :class="{ 'change-image': list }" @click="triggerFileInput" v-loading="loading">
            <i class="el-icon-plus"></i>
            <p>上传图片</p>
          </div>
          <input
            type="file"
            name="file"
            style="display: none"
            class="file-input"
            multiple
            ref="fileEle1"
            @change="handleFileChange"
          />
        </div>
      </template>
    </oss-upload>
  </div>
</template>
<script>
import api from '@/api';
export default {
  name: 'applyUpload',
  props: {
    uploadType: {
      type: String
    },
    preview: {
      type: Boolean
    },
    list: {
      type: String
    },
    size: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      ossOpt: {
        parameters: {
          authkey: '',
          product_line: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp',
          space: 'kmf-image',
          subject: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp'
        },
        types: ['jpg', 'jpeg', 'png'],
        maxSize: this.size,
        multiple: true,
        maxLength: 1,
        fileList: [],
        showProgress: true,
        overReplace: true
      },
      tokenPic: ''
    };
  },
  watch: {
    list(value) {
      this.ossOpt.fileList = [
        {
          src: this.list,
          isUpload: true
        }
      ];
    }
  },
  created() {
    if (this.list) {
      this.ossOpt.fileList = [
        {
          src: value,
          isUpload: true
        }
      ];
    }
    if (this.uploadType == 'logo') {
      this.ossOpt.parameters.space = 'kmf-image';
    } else {
      this.ossOpt.parameters.space = 'kmf-cpp';
    }
  },
  methods: {
    previewImg(url) {
      if (this.preview) {
        this.$alert(`<img style="max-height:600px" src="${url}">`, '预览', {
          dangerouslyUseHTMLString: true,
          customClass: 'view-img',
          showConfirmButton: false,
          closeOnClickModal: true,
          showClose: false
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    //触发文件上传的change事件调用组件方法
    handleFileChange(e) {
      this.$refs.filesEle.handleFileChange(e);
      this.loading = true;
    },
    // 点击该按钮触发文件控件的点击事件
    triggerFileInput() {
      this.$refs.fileEle1.click();
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    // 上传成功回调
    uploadSuccess(res, type) {
      if (this.list) {
        this.$emit('success', {
          file: res.result,
          type: type
        });
        this.loading = false;
      } else {
        this.$emit('success', {
          file: res.result.file,
          type: type
        });
        if (type == 'certificate_picture') {
          this.getTokenPic(res.result.file);
        } else {
          this.loading = false;
        }
      }
    },
    uploadFailed(err) {
      console.log('上传失败', err);
      this.loading = false;
      // 上传失败后的回调
      this.$message.error((err && err.msg) || '上传失败，请联系我们');
    },
    uploadError(err) {
      this.loading = false;
      this.$message.error(err.msg);
    },
    deleteUploadFile(res, type) {
      this.$emit('del', type);
    },
    // 获取营业执照
    async getTokenPic(file) {
      let _this = this;
      try {
        const res = await api.getCompanyPicture({
          img: file
        });
        console.log(res);
        var reader = new FileReader();
        reader.onload = function (e) {
          _this.ossOpt.fileList = [
            {
              src: e.target.result,
              isUpload: true
            }
          ];
        };
        reader.readAsDataURL(res);
      } catch (error) {}

      this.loading = false;
    }
  }
};
</script>
<style lang="css">
.view-img {
  width: auto;
  height: auto;
}
</style>
<style lang="scss" scoped>
.upload-con {
  position: relative;
  &:hover {
    .edit-upload-image {
      display: block;
    }
  }
}
.upload-area {
  width: 120px;
  height: 120px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border: 1px dashed rgba(204, 204, 204, 1);
  text-align: center;
  color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  i {
    font-size: 36px;
    margin-top: 24px;
  }
}
.my-uplaod-image {
  width: 120px !important;
  height: 120px !important;
}
.change-image {
  border: 0 !important;
  background: #fff;
  cursor: pointer;
}
.edit-upload-image {
  position: absolute;
  z-index: 9;
  display: none;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 80px;
  width: 80px;
  height: 80px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  border-radius: 10px 10px 24px 10px;
}
.myradius {
  border-radius: 10px 10px 24px 10px;
}
</style>
