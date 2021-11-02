<!--
*
* 素材库图片弹框
*
-->
<template>
  <el-dialog title="选择图片" :show-close="true" :visible.sync="dialogVisible">
    <div class="content-all content-all-image">
      <div class="left-area">
        <p class="m-tab">全部图片</p>
      </div>
      <div class="right-area">
        <div class="">
          <div style="text-align: right; margin: 12px 24px 0 0">
            <span class="image-tips">图片大小大于5K，小于10M</span>

            <el-tooltip placement="bottom" popper-class="popper-class-image" effect="light">
              <div slot="content">
                上传图片请遵守国家法律法规系统将对你上传的图片进行审核，如违反国家法律法规，所上传的图片将无法展示。
              </div>
              <i class="qzfont qzwenhao1"></i>
            </el-tooltip>
            <el-button type="primary" @click="showImageUpload">上传图片</el-button>
          </div>

          <div class="content-show">
            <image-upload ref="ImageUpload" :isDialog="true" @uploadSuccess="uploadSuccess"></image-upload>

            <div class="item-box" v-for="item in list" :key="item.id" :title="item.show_name || item.file_name">
              <div class="z-item" :style="{ background: current === item.id ? 'rgba(0, 0, 0, 0.5)' : '' }">
                <!-- 未过审样式 -->
                <!-- 002航班需求 发布内容时从素材库选择图片时可以选择素材库所有图片 -->
                <el-radio
                  v-model="current"
                  :label="item.id"
                  class="radio-class"
                  style="z-index: 100; margin-right: 0px; right: 0"
                  ><span></span>
                </el-radio>
                <!-- <div class="not-too-careful" v-if="item.state == 2">
                  <p class="tip-main-p">
                    <span class="tip-main-icon">!</span><span class="tip-main-content" style="">该图片未过审</span>
                  </p>
                  <p class="tip-main-p" style="margin-top: 19px">
                    <span class="tip-main-content" style="">原因：{{ item.reason_keyword }}</span>
                  </p>
                </div>
                <div class="not-too-careful" v-if="item.state == 0">
                  <p class="tip-main-p">
                    <span class="tip-main-content" style="">审核中</span>
                  </p>
                </div> -->
                <!-- 展示图片类型 -->
                <img
                  v-if="item.file_path"
                  :src="'//image.kmf.com/' + item.file_path"
                  :alt="item.show_name"
                  class="image-class"
                  @click="selectMaterial(item)"
                />
                <img
                  v-else
                  src="~@/assets/no-image@2x.png"
                  class="image-class"
                  style="width: 84px"
                  @click="selectMaterial(item)"
                />
              </div>
              <div class="upload-content-time">
                <p class="p-left">{{ item.show_name || item.file_name }}</p>
                <!-- <p class="p-right">{{ item.created_at.split(' ')[0] }}</p> -->
              </div>
            </div>

            <div v-if="!list.length" class="no-image-list">
              <img src="~@/assets/no-image-list@2x.png" alt="" />
              <p>还没有上传图片哦~</p>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :current-page="page"
          :total="total"
          :page-size="20"
          @current-change="handleCurrentChange"
          hide-on-single-page
          style="text-align: right; margin: 20px"
        >
        </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="type == 'cover'">
      <el-button type="primary" @click="submit()" :disabled="!current" size="mini">下一步</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button size="mini" plain @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit()" :disabled="!current" size="mini">确 定</el-button>
    </span>
    <ImageCropper ref="ImageCropper" @imageCropperSuccess="imageCropperSuccess"></ImageCropper>
  </el-dialog>
</template>
<script>
import api from '../../../_api';
import ImageUpload from '../../material/components/ImageUpload';
import ImageCropper from './ImageCropper';

export default {
  name: 'ImageDialog',
  data() {
    return {
      dialogVisible: false,
      currentInfo: {},
      current: 0,
      page: 1,
      total: 0,
      list: [],
      type: ''
    };
  },
  props: {},
  components: {
    ImageUpload,
    ImageCropper
  },
  computed: {},
  methods: {
    showMaterialDialog(type) {
      this.type = type || '';
      this.currentInfo = {};
      this.current = 0;
      this.getMediaList();
      this.dialogVisible = true;
    },
    showImageUpload() {
      this.$refs.ImageUpload.uploadMaterial();
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
      let { result } = await api.getMediaList({ type: 0, page: this.page });
      this.list = result.list;
      this.total = result.count;
    },
    submit() {
      if (!this.currentInfo.file_path) {
        this.$message.error('请选择素材！');
        return false;
      }
      if (this.type == 'cover') {
        this.$refs.ImageCropper.init(this.currentInfo.file_path, this.currentInfo.show_name);
      } else {
        this.$emit('submitSucceed', {
          info: this.currentInfo,
          type: this.type
        });
        this.dialogVisible = false;
      }
    },
    uploadSuccess() {
      this.getMediaList();
      let _this = this;
      setTimeout(() => {
        _this.getMediaList();
      }, 5000);
    },
    selectMaterial(item) {
      this.currentInfo = item;
      this.current = item.id;
    },
    imageCropperSuccess(info) {
      this.dialogVisible = false;
      this.$emit('submitSucceed', info);
    }
  },
  watch: {
    current(newVal) {
      this.list.forEach((item) => {
        if (item.id == newVal) {
          this.currentInfo = item;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../material/components/material.scss';
@import url('../../alicdn/iconfont.css');

.image-tips {
  height: 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 16px;
  margin-right: 7px;
}
.qzwenhao1 {
  color: rgba(0, 0, 0, 0.3);
  margin-right: 18px;
}

.no-image-list {
  display: block;
  text-align: center;
  margin: 38px auto;

  img {
    width: 50%;
  }
  p {
    height: 19px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 19px;
  }
}
.content-all-image .content-show .item-box {
  .upload-content-time {
    width: 150px;
    .p-left {
      width: 100%;
    }
  }

  .z-item {
    width: 150px;
    height: 150px;
    line-height: 150px;
    .show-img {
      max-width: 150px;
      max-height: 150px;
    }
    .not-too-careful {
      width: 150px;
      height: 150px;
    }
    .tip-main-p {
      margin-top: 50px;
    }
  }
}
.image-class {
  vertical-align: middle;
  max-width: 100%;
  max-height: 100%;
}
</style>
<style>
.el-tooltip__popper.popper-class-image {
  background: #fff;
  padding: 27px 18px;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  width: 210px;
  box-shadow: 0px 8px 28px 8px rgba(0, 0, 0, 0.02), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 2px 6px -2px rgba(0, 0, 0, 0.12);
  text-align: left;
  border: none;
}
.el-tooltip__popper.popper-class-image .popper__arrow {
  /* border-color: #fff; */
  border: none;
  box-shadow: 0px 8px 28px 8px rgba(0, 0, 0, 0.02), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 2px 6px -2px rgba(0, 0, 0, 0.12);
}

.image-class {
  vertical-align: middle;
  max-width: 100%;
  max-height: 100%;
}
</style>
<style lang="scss" scoped>
.content-all-image {
  display: flex;
  padding: 0;
}

.left-area {
  width: 130px;
  .m-tab {
    text-align: center;
    margin-top: 16px;
    cursor: pointer;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
}
.right-area {
  flex: 1;
  .area-title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    display: inline-block;
    margin-right: 30px;
  }
}

/deep/ .el-dialog .el-dialog__header {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid #ebebeb;
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
