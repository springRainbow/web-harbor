<!--
*
* 视频+封面+摘要
*
-->
<template>
  <div class="cover-and-abstract" :style="mt25()">
    <!-- info_type为1视频上传 -->
    <div class="z-item" v-if="info_type" style="width: 600px">
      <div class="upload-btn" @click="uploadVideo" v-if="!material.length" style="width: 600px">
        <img src="~@/assets/add@2x.png" class="add-pic" alt="" />
        <p class="upload-qrcode">添加视频</p>
      </div>
      <div v-else @click="uploadVideo" class="upload-btn" style="width: 600px">
        <img v-if="videoCover" :src="`${videoCover}`" class="cover-img" alt="" />
        <img v-else src="~@/assets/img-loading.png" class="cover-img" alt="" />
      </div>
    </div>
    <div class="z-item-p">
      <div class="upload-btn" @click="uploadCover">
        <div v-if="!cover">
          <img src="~@/assets/add@2x.png" class="add-pic" alt="" />
          <p class="upload-qrcode">选择封面</p>
        </div>
        <img v-else :src="`${cover.includes('.com/') ? '' : '//image.kmf.com/'}${cover}`" class="cover-img" alt="" />
      </div>
      <p class="editor-tips" v-if="!info_type">图片尺寸：5k＜图片大小＜4M；340px＜长/宽＜2340px</p>
    </div>
    <div class="editor-tips" v-if="info_type" style="margin-top: 140px; margin-left: 20px">
      <p>封面图必填</p>
      <p>图片尺寸：5k＜图片大小＜4M；340px＜长/宽＜2340px</p>
    </div>
    <!-- 图文时需要填写摘要，视频不需要 -->
    <div class="abstract" v-if="!info_type">
      <el-input
        type="textarea"
        v-model="abstract"
        placeholder="请输入摘要……"
        maxlength="100"
        show-word-limit
      ></el-input>
      <p class="editor-tips">最多输入100字（可不填）</p>
    </div>
    <!-- 素材库视频和图片选择 -->
    <MaterialImage ref="materialImgDialog" @submitSucceed="submitImgSucceed"></MaterialImage>
    <MaterialVideo ref="materialVideoDialog" @submitSucceed="submitVideoSucceed"></MaterialVideo>
  </div>
</template>
<script>
import MaterialImage from './MaterialImage.vue';
import MaterialVideo from './MaterialVideo.vue';

export default {
  data() {
    return {
      abstract: '',
      cover: '',
      material: []
    };
  },
  props: {
    contact_card: {},
    info_type: Number
  },
  components: {
    MaterialImage,
    MaterialVideo
  },
  mounted() {},
  created() {
    console.log(this.info_type);
  },
  methods: {
    //上传封面
    uploadCover() {
      this.$refs.materialImgDialog.showMaterialDialog('cover');
    },
    //上传视频
    uploadVideo() {
      this.$refs.materialVideoDialog.showMaterialDialog();
    },
    //获取封面信息 - createContent.vue中调用
    getCoverAndAbstractInfo() {
      let obj = {
        cover: this.cover.split('/')[this.cover.split('/').length - 1] //封面图片文件名称
      };
      //当info_type==1（发布视频）时material为视频信息，但是摘要不在这里，在editor中的正文
      if (this.info_type == 1) {
        obj.material = this.material;
      } else {
        obj.abstract = this.abstract;
      }
      return obj;
    },
    //设置封面和摘要信息
    setCoverAndAbstractInfo(result) {
      this.cover = result.cover;
      this.abstract = result.abstract;
      this.$nextTick(() => {
        if (this.info_type == 1) {
          this.material = result.material;
        }
        console.log(this.cover, this.abstract);
      });
    },
    mt25() {
      return this.info_type == 1 ? 'margin-top:25px' : '';
    },
    submitImgSucceed(info) {
      this.cover = info.path;
      this.$QzMessage({
        content: '封面设置成功'
      });

      console.log(this.cover);
    },
    //视频上传回调
    submitVideoSucceed({ info }) {
      this.material = [
        {
          id: info.id,
          type: 'video',
          key_word: JSON.stringify(info),
          sequence: 1,
          file_name: info.file_name
        }
      ];
    }
  },
  watch: {
    //摘要变化要更新预览区--后期迭代去掉了
    // abstract() {
    //   this.$emit('sendInfo', {
    //     abstract: this.abstract,
    //     cover: this.cover
    //   });
    // },
    //封面变化要更新预览区--后期迭代去掉了
    // cover() {
    //   this.$emit('sendInfo', {
    //     abstract: this.abstract,
    //     cover: this.cover
    //   });
    // }
  },
  computed: {
    videoCover() {
      return this.material.length ? JSON.parse(this.material[0].key_word).cover_url : '';
    }
  }
};
</script>
<style lang="scss" scoped>
.cover-and-abstract {
  display: flex;
  .z-item-p {
    width: 240px;
  }
  .z-item {
    margin-right: 46px;
    width: 240px;
  }
  .upload-btn {
    position: relative;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    border: 1px solid rgba(204, 204, 204, 1);
    // width: 100%;
    width: 206px;
    height: 206px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed rgba(204, 204, 204, 1);
    position: relative;
    display: flex;
    align-items: center;
    .cover-img {
      max-height: 100%;
      max-width: 100%;
      margin: 0 auto;
    }
  }
  .add-pic {
    position: absolute;
    left: 50%;
    top: 43%;
    transform: translate(-50%, -50%);
    width: 40px;
    z-index: 10;
  }
  .upload-qrcode {
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 60%;
    height: 18px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.2);
  }
  .abstract {
    flex: 1;
    /deep/ .el-textarea__inner {
      height: 206px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      font-size: 14px;
      padding: 14px 20px;
    }
  }
  .editor-tips {
    margin-top: 10px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.2);
    line-height: 23px;
  }
}
</style>
