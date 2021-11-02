<template>
  <div>
    <div
      style="position: absolute; padding: 7px 20px; top: 32px; right: 24px; background: #fff; opacity: 1; z-index: 1000"
      :class="{ getPosition: isDialog }"
    >
      <span class="image-tips">仅支持MP4格式视频，视频小于2G</span>
      <el-tooltip placement="bottom" popper-class="popper-class-image popper-class-image-video" effect="light">
        <div slot="content">
          <p class="video-tips">仅支持MP4格式视频，视频小于2G</p>
          <p>
            敬告：<span style="font-weight: bold">系统将对你上传的视频进行审核</span> 请不要上传违反任何国家法律法规的或
            侵犯他人权利的视频内容。
          </p>
        </div>
        <i class="qzfont qzwenhao1"></i>
      </el-tooltip>
      <el-button type="primary" @click="uploadMaterial" :disabled="isUploading">添加视频素材</el-button>
    </div>
    <el-form ref="form" :model="form" inline @submit.native.prevent>
      <el-form-item label="视频名称：" prop="user_name">
        <el-input
          v-model.trim="form.file_name"
          placeholder="请输入视频名称搜索"
          @keyup.enter.native="search"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" plain @click="reset1">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <div class="group">默认分组</div> -->
    <div class="content-video-show">
      <div class="video-item-box table-title" style="">
        <div class="video-content">视频</div>
        <div class="video-time">更新时间</div>
        <div class="video-op">操作</div>
      </div>
      <video-upload @uploadSuccess="uploadSuccess" ref="videoUpload" @videoUploading="videoUploading"></video-upload>
      <div v-if="total">
        <div class="video-item-box" v-for="item in list" :key="item.id" :title="item.show_name || item.file_name">
          <div class="z-item">
            <!-- 展示存在封面的视频 -->
            <img
              class="show-img"
              v-if="item.cover_url"
              :src="item.cover_url"
              :alt="item.show_name"
              @click="showVideo(item.file_path, item.show_name)"
              style="vertical-align: middle"
            />
            <!-- 展示未获取视频截图的样式 -->
            <img
              v-else
              class="show-img"
              src="~@/assets/img-loading.png"
              :alt="item.show_name"
              @click="showVideo(item.file_path, item.show_name)"
            />
            <!-- 视频播放的按钮 -->

            <img
              v-if="item.transcode_state === 2"
              src="~@/assets/player@2x.png"
              class="player-icon"
              @click="showVideo(item.file_path, item.show_name)"
            />
          </div>
          <div class="video-content">
            <p class="video-content-title">{{ item.show_name || item.file_name }}</p>
            <p class="video-content-file">
              <span style="margin-right: 20px"
                >大小：{{ item.file_size == 0 ? '--' : `${(item.file_size / 1024 / 1024).toFixed(2)}M` }}</span
              ><span>时长：{{ item.duration == 0 ? '--' : getTimeBysecond(item.duration) }}</span>
            </p>
          </div>
          <div class="video-time">
            <p>{{ item.created_at }}</p>
          </div>
          <div class="video-op">
            <el-button type="text" @click="deleteVideo(item.id)" v-if="!isDialog">删除</el-button>
            <el-radio v-else v-model="selectMaterial" :label="item" @change="setSelectMaterial"><span></span></el-radio>
          </div>
        </div>
      </div>
      <div class="no-content-aera" v-if="!total">
        <img class="no-content-image" src="~@/assets/bg-no-content.png" />
        <p class="no-content">未找到相关数据</p>
      </div>
    </div>

    <VideoShow ref="VideoShow"></VideoShow>
  </div>
</template>
<script>
import VideoShow from './VideoShow';
import VideoUpload from './VideoUpload';

import api from '../../../_api';

import { mixins } from './mixin';
export default {
  name: 'VideoList',
  mixins: [mixins],
  data() {
    return {
      form: {
        file_name: ''
      },
      selectMaterial: {},
      isUploading: false
    };
  },
  props: {
    list: Array,
    isDialog: Boolean,
    total: Number
  },
  components: {
    VideoShow,
    VideoUpload
  },
  methods: {
    uploadMaterial() {
      this.$refs.videoUpload.uploadMaterial();
    },
    showVideo(path, name) {
      if (this.isDialog) {
        return false;
      }
      this.$refs.VideoShow.init(path, name);
    },
    uploadSuccess() {
      this.$emit('getMediaList');
      this.clearSearch();
    },
    videoUploading(status) {
      this.isUploading = status;
    },
    getTimeBysecond(s) {
      let hour = Math.floor(s / 3600),
        min = Math.floor(s / 60) % 60,
        sec = s % 60,
        t;
      if (hour < 10) {
        t = '0' + hour + ':';
      } else {
        t = hour + ':';
      }

      if (min < 10) {
        t += '0';
      }
      t += min + ':';
      if (sec < 10) {
        t += '0';
      }
      t += sec;
      return t;
    },
    deleteVideo(id) {
      let _this = this;
      this.$confirm(`确定删除么？`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(async () => {
          let { result, status, message } = await api.delMaterial({
            type: 1,
            ids: id.toString()
          });
          if (status == 200) {
            _this.$QzMessage({
              content: `已删除${result}个文件`
            });
            _this.$emit('deleteSuccess', false);
          } else {
            _this.$message({
              message: message,
              type: 'error'
            });
          }
        })
        .catch(() => {});
    },
    search() {
      this.clearSearch();
      this.$emit('refresh', this.form.file_name);
    },
    reset1() {
      this.form.file_name = '';
      this.search();
    },
    setSelectMaterial() {
      this.$emit('selectMaterial', JSON.parse(JSON.stringify(this.selectMaterial)));
    },
    clearSearch() {
      this.selectMaterial = {};
      this.setSelectMaterial();
    }
  }
};
</script>
<style lang="scss" scoped>
@import url('../../alicdn/iconfont.css');
@import './material.scss';
.item-box {
  position: relative;
}
.checkbox-class {
  right: 26px;
}
.table-title {
  padding: 12px !important;
  background: #f5f5f5;
  div {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    line-height: 24px;
  }
}
.content-video-show {
  .video-item-box {
    border-bottom: 1px solid #ebebeb;
    display: flex;
    padding: 18px 12px;
  }
  .z-item {
    width: 120px;
    height: 68px;
    line-height: 68px;
    margin-right: 12px;
    .show-img {
      max-width: 120px;
      max-height: 68px;
    }
  }
  .video-content {
    flex: 1;
    &-title {
      height: 48px;
      font-size: 14px;
      line-height: 24px;
    }
    &-file {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      line-height: 20px;
    }
  }

  .video-time {
    width: 180px;
    text-align: center;
    position: relative;
    p {
      position: absolute;
      bottom: 0;
    }
  }
  .video-op {
    width: 100px;
    text-align: center;
    position: relative;
    .el-button,
    .el-radio {
      position: absolute;
      bottom: 0;
      padding: 0;
      height: 21px;
    }
  }
}
.video-tips {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 22px;
  margin-bottom: 8px;
}
.getPosition {
  top: 24px;
  right: 56px;
}
.no-content-aera {
  position: relative;
  top: 0px;
  z-index: 100;
  background: #fff;
  text-align: center;
}
.no-content-image {
  position: relative;
  width: 394px;
  margin-top: 100px;
}
.no-content {
  height: 19px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 19px;
  text-align: center;
}
</style>
<style>
.popper-class-image-video {
  width: 240px !important;
  font-size: 14px;
  line-height: 22px;
}
</style>
