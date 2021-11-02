<template>
  <div>
    <div style="position: absolute; top: 32px; right: 24px; padding: 7px 20px">
      <span class="image-tips">图片大小大于5K，小于10M</span>
      <el-tooltip placement="bottom" popper-class="popper-class-image" effect="light">
        <div slot="content">
          上传图片请遵守国家法律法规系统将对你上传的图片进行审核，如违反国家法律法规，所上传的图片将无法展示。
        </div>
        <i class="qzfont qzwenhao1"></i>
      </el-tooltip>
      <el-button type="primary" @click="showImageUpload">上传图片</el-button>
    </div>

    <div class="group">全部图片（{{ total }}）</div>
    <div class="operation-btn" v-show="delArray.length">
      <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button type="text" @click="submit(0)">删除</el-button>
    </div>
    <el-checkbox-group v-model="delArray" @change="handleCheckedChange">
      <div class="content-show">
        <image-upload ref="ImageUpload" @uploadSuccess="uploadSuccess"></image-upload>

        <div class="item-box" v-for="item in list" :key="item.id" :title="item.show_name || item.file_name">
          <div class="z-item" :style="{ background: delArray.indexOf(item.id) != -1 ? 'rgba(0, 0, 0, 0.5)' : '' }">
            <el-checkbox :label="item.id" v-show="delArray.indexOf(item.id) != -1" class="checkbox-class"
              ><span></span
            ></el-checkbox>

            <!-- 注释：002航班需求-不展示素材库中的审核状态 -->

            <!-- <div class="not-too-careful" v-if="item.state == 2">
              <p class="tip-main-p">
                <span class="tip-main-icon">!</span><span class="tip-main-content" style="">该图片未过审</span>
              </p>
              <p class="tip-main-p" style="margin-top: 19px">
                <span class="tip-main-content" style="">原因：{{ item.reason_keyword }}</span>
              </p>
            </div> -->
            <!-- <div class="not-too-careful" v-if="item.state == 0">
              <p class="tip-main-p" style="margin-top: 85px">
                <span class="tip-main-content" style="">审核中</span>
              </p>
            </div> -->
            <!-- 展示图片类型 -->
            <img
              v-if="item.file_path"
              :src="'//image.kmf.com/' + item.file_path"
              :alt="item.show_name"
              class="image-class"
            />
            <img v-else src="~@/assets/no-image@2x.png" class="image-class" style="width: 84px" />
          </div>
          <div class="upload-content-time">
            <p class="p-left">{{ item.show_name || item.file_name }}</p>
            <p class="p-right">{{ item.created_at.split(' ')[0] }}</p>
          </div>
        </div>
      </div>
    </el-checkbox-group>

    <div v-if="!total" class="no-image-list">
      <img src="~@/assets/no-image-list@2x.png" alt="" />
      <p>还没有上传图片哦~</p>
    </div>
  </div>
</template>
<script>
import { mixins } from './mixin';
import ImageUpload from './ImageUpload';

export default {
  name: 'ImageList',
  mixins: [mixins],
  data() {
    return {
      isIndeterminate: true,
      checkAll: false
    };
  },
  props: {
    list: Array,
    total: Number
  },
  components: {
    ImageUpload
  },
  computed: {
    listIds() {
      return this.list.map((item) => item.id);
    }
  },
  methods: {
    showImageUpload() {
      this.$refs.ImageUpload.uploadMaterial();
    },
    uploadSuccess() {
      this.$parent.uploadSuccess();
    },
    handleCheckAllChange(val) {
      console.log(this.listIds);
      this.delArray = val ? this.listIds : [];
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.list.length;
    }
  }
};
</script>
<style lang="scss" scoped>
@import url('../../alicdn/iconfont.css');
@import './material.scss';

.z-item:hover {
  box-sizing: border-box;
  border: 1px solid #15cfdc;
  .el-checkbox {
    display: block !important;
  }
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
.operation-btn {
  display: flex;
  background: #f6f6f6;
  border-radius: 4px;
  margin-top: 16px;
  padding: 9px 16px;
  position: relative;
  .el-checkbox {
    flex: 1;
    display: block;
  }
  .el-button {
    width: 100px;
    padding: 0;
    height: auto;
    width: auto;
  }
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
