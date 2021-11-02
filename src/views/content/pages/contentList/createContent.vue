<!--
*
* 内容生产
*
-->
<template>
  <div class="content-main" @scroll="menu" style="">
    <p class="editor-title">{{ info_type ? '创作视频' : '创作图文' }}</p>
    <!-- 发布视频是封面在上面，需要添加视频 -->
    <div class="flex-area">
      <div class="editor-area" style="width: 100%">
        <CoverAndAbstract
          ref="coverAndAbstract"
          v-if="info_type"
          :info_type="info_type"
          @sendInfo="sendInfo"
        ></CoverAndAbstract>
        <Editor
          ref="editor"
          :info_type="info_type"
          @sendInfo="sendInfo"
          :is_official="is_official"
          :scrollTop="scrollTop"
        ></Editor>
        <div class="big-title" v-if="!info_type">封面和摘要 <span class="tit-tips">（封面必填）</span></div>
        <CoverAndAbstract @sendInfo="sendInfo" ref="coverAndAbstract" v-if="!info_type"></CoverAndAbstract>
      </div>
      <!-- 注释：002航班需求-不展示效果预览图 -->
      <!-- <div class="preview-content">
        <div class="preview-area">
          <p class="preview-area-title">效果预览图</p>
          <div class="preview-area-content" v-if="!info.cover"></div>
          <img
            :src="`${info.cover.includes('.com/') ? '' : '//image.kmf.com/'}${info.cover}`"
            alt=""
            v-if="info.cover"
            style="width: 268px; margin: 16px 0; border-radius: 4px"
          />

          <p class="preview-area-title">{{ info.title || '文章标题' }}</p>
          <p class="preview-area-abstract">{{ info.abstract || '这是内容简介…..' }}</p>
        </div>
      </div> -->
    </div>

    <div class="big-title">
      内容标签
      <el-tooltip placement="right" popper-class="popper-class-image popper-class-image1" effect="light">
        <div slot="content" class="qz-tooltip-content">
          <div>
            <p class="tooltip-title">内容标签说明</p>
          </div>
          <div class="tooltip-content">
            <div class="tooltip-little-title">院校资讯</div>
            <div class="div-content">
              和院校相关内容可选择此分类，如某院校的动态、新闻等，选择此分类后可以为内容打上院校专业标签，如该内容是哪个院校的，适合哪些专业的考生阅读。
            </div>
          </div>
          <div class="tooltip-content">
            <div class="tooltip-little-title">专业课备考</div>
            <div class="div-content">
              和专业相关内容可选择此分类，如某个专业的动态、备考经验等，选择此分类后可为内容打上专业、院校标签指定
              哪个专业，哪些院校的考生可以阅读。
            </div>
          </div>
          <div class="tooltip-content">
            <div class="tooltip-little-title">考研届数</div>
            <div class="div-content">可以选择指定哪届的考生可以阅读此文章，如不选则任何届的考生均可看到。</div>
          </div>
          <div class="tooltip-content">
            <div class="tooltip-little-title">考研阶段</div>
            <div class="div-content">
              可以标记内容是适合处于考研哪个阶段的考生可以阅读，如不选择则任何届数的考生均可看到。
            </div>
          </div>
          <div class="tooltip-content">
            <div class="tooltip-little-title">推荐标签</div>
            <div class="div-content">可以标记内容适合哪类考生阅读，如一站、二战、跨考等。</div>
          </div>
          <div class="tooltip-content">
            <div class="tooltip-little-title">自定义标签</div>
            <div class="div-content">可以标记内容适合哪类考生阅读，如一站、二战、跨考等。</div>
          </div>
        </div>
        <img style="width: 16px" src="~@/assets/tip@2x.png" />
      </el-tooltip>
      <span class="tit-tips">准确的标签可以让内容更准确的推送</span>
    </div>
    <Tags ref="tags"></Tags>
    <div class="big-title" v-if="info_type">
      咨询卡片 <span class="tit-tips">（选填项，配置后可在内容中展示，方便用户联系）</span>
    </div>
    <VideoConsultCard ref="videoConsultCard" v-if="info_type" :is_official="is_official"></VideoConsultCard>
    <div class="opt-area">
      <el-button plain @click="submitDrafts">保存草稿</el-button>
      <el-button plain @click="preview">预览</el-button>
      <el-button type="primary" @click="publish()">直接发布</el-button>
      <el-button plain @click="publish(true)">定时发布</el-button>
    </div>
    <p class="opt-area-text">*视频类内容根据视频时长决定审核时间长度，审核完成后会进行短信通知，记得关注信息哦！</p>
    <div class="consult-card" v-if="showPublish">
      <div class="card-title-area">
        <span class="card-title" v-if="isTiming">定时发布</span>
        <span class="card-title" v-if="!isTiming">直接发布</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="发布时间" required="" v-if="isTiming">
          <el-date-picker
            v-model="ruleForm.publish_datetime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <p :class="[isTiming ? 'tit-tips' : 'tit-tips-publish']">发布后，内容会展示到APP对应板块内，确定发布吗？</p>
        <el-form-item style="text-align: right; margin-top: 12px; margin-bottom: 0px">
          <el-button size="small" plain @click="cancal" style="padding: 7px 34px">取消</el-button>
          <el-button size="small" type="primary" @click="submit(1)" style="padding: 7px 34px">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="m-modal" v-if="showPublish"></div>
    <Preview ref="preview"></Preview>
  </div>
</template>

<script>
import Editor from './components/Editor';
import CoverAndAbstract from './components/CoverAndAbstract';
import Tags from './components/Tags';
import VideoConsultCard from './components/VideoConsultCard';
import Preview from './components/Preview.vue';

import api from '../../_api';

export default {
  components: {
    Editor,
    CoverAndAbstract,
    Tags,
    VideoConsultCard,
    Preview
  },
  data() {
    return {
      info_type: 0, //0图文，1视频
      showPublish: false,
      ruleForm: {
        publish_datetime: ''
      },
      isTiming: false, //是否定时
      rules: {},
      uuid: '',
      info: {
        cover: '',
        title: '',
        abstract: ''
      }, //预览信息返回的内容
      pickerOptions: {
        //设置时间选择器的禁用时间
        disabledDate(time) {
          let a = time.getTime() > Date.now() + 3600 * 1000 * 24 * 7;
          let b = time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          return a || b;
        }
      },
      submitData: {},
      is_official: false, //是不是自营，自营才可以有小程序
      scrollTop: 0
    };
  },
  mounted() {
    let that = this;
    window.onbeforeunload = function (e) {
      if (that.$route.name == 'createContent') {
        e = e || window.event;
        if (e) {
          e.returnValue = '关闭提示';
        }
        return '关闭提示';
      } else {
        window.onbeforeunload = null;
      }
    };
    this.info_type = parseInt(this.$route.query.info_type || 0);
    let data = {
      uuid: this.$route.query.uuid,
      news_uuid: this.$route.query.news_uuid
    };
    if (data.uuid || data.news_uuid) {
      this.getContentDetails(data);
    }
    this.getUserDetail();
  },
  methods: {
    menu(e) {
      this.scrollTop = e.target.scrollTop;
    },
    submitDrafts() {
      this.verify(0);
    },
    publish(isTiming) {
      if (this.verify(1)) {
        this.isTiming = isTiming ? true : false;
        this.showPublish = true;
      }
    },
    preview() {
      //预览
      this.verify(0, true);
    },
    verify(edit_flag, isPreview) {
      let form = {
        edit_flag,
        info_type: this.info_type,
        tenant_uuid: localStorage.getItem('HARBOR_ID')
      };
      this.uuid && (form.uuid = this.uuid);
      const coverAndAbstract = this.$refs.coverAndAbstract.getCoverAndAbstractInfo();
      const editor = this.$refs.editor.getEditorContent();
      if (!!this.info_type) {
        form.contact_card = this.$refs.videoConsultCard.getVideoConsultCardInfo();
        if (!form.contact_card) {
          console.log('视频建联卡片校验错误');
          return false;
        }
      }
      if (!edit_flag) {
        //草稿-校验标题/作者/内容 至少有一个
        if (
          (!this.info_type && !(editor.title || editor.author_name || editor.content)) ||
          (this.info_type && !(editor.title || editor.author_name || editor.abstract))
        ) {
          this.$message.error('标题、作者、正文至少有一项要有内容');
          return false;
        }
      } else {
        if (!editor.title) {
          this.$message.error('请输入标题');
          return false;
        }
        if (!editor.author_name) {
          this.$message.error('请输入作者');
          return false;
        }
        if (!this.info_type && !editor.content) {
          this.$message.error('请输入内容');
          return false;
        }
        if (!coverAndAbstract.cover) {
          this.$message.error('请选择封面');
          return false;
        }
        if (this.info_type && !coverAndAbstract.material.length) {
          this.$message.error('请添加视频');
          return false;
        }
      }
      const tags = this.$refs.tags.getAllTags(!edit_flag);
      if (edit_flag && !tags) {
        console.log('标签校验错误');
        return false;
      }
      let data = { ...tags, ...editor, ...coverAndAbstract, ...form };
      this.submitData = data;
      console.log(data);
      if (!edit_flag) {
        this.submit(edit_flag, isPreview);
      }
      return true;
    },
    async submit(edit_flag, isPreview) {
      if (edit_flag && !this.ruleForm.publish_datetime && this.isTiming) {
        this.$message.error('请选择发布时间');
        return false;
      }
      if (this.ruleForm.publish_datetime) {
        this.submitData.publish_datetime = this.ruleForm.publish_datetime;
      }
      let { result, status, message } = await api.submitContent(this.submitData);
      if (status == 200) {
        if (!isPreview) {
          this.$router.push({
            path: '/content/list',
            query: {
              u: this.$route.query.u,
              audit_flag: edit_flag ? '0' : '-1'
            }
          });
        } else {
          this.uuid = result.uuid;
          this.$refs.preview.showPreview(result.uuid, 'draft');
        }
      } else {
        this.$message.error(message);
      }
    },
    cancal() {
      this.isTiming = false;
      this.showPublish = false;
    },
    sendInfo(info) {
      Object.assign(this.info, info);
    },
    async getContentDetails(data) {
      let { result } = await api.getDraftsInfo(data);
      this.info_type = result.info_type;
      this.uuid = result.uuid;
      this.$refs.editor.setEditorContent(result);
      this.$refs.tags.setAllTags(result);
      this.$refs.coverAndAbstract.setCoverAndAbstractInfo(result);
      this.$nextTick(() => {
        if (!!this.info_type) {
          console.log(this.$refs.videoConsultCard, this.info_type);
          this.$refs.videoConsultCard.setVideoConsultCardInfo(result);
        }
      });
    },
    async getUserDetail() {
      let { result } = await api.getHarborDetail({
        uuid: localStorage.getItem('HARBOR_ID')
      });
      this.is_official = !!result.tenant.is_official || false;
    }
  },
  watch: {},
  beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
@import './components/card.scss';
.consult-card {
  width: 320px;
}
</style>
<style lang="scss">
.content-main {
  padding: 32px;
  max-height: 1000px;
  overflow: scroll;
  .editor-title {
    height: 32px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.8);
    line-height: 32px;
  }
}

.big-title {
  margin-top: 32px;
  margin-bottom: 15px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 26px;
  margin-left: -32px;
}
.tit-tips {
  margin-left: 8px;
  height: 22px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
}
.tit-tips-publish {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 26px;
}
.big-title::before {
  content: ' ';
  width: 4px;
  height: 26px;
  background: #15cfdc;
  border-radius: 2px;
  display: inline-block;
  position: relative;
  top: 8px;
  margin-right: 28px;
}
.opt-area {
  text-align: center;
  margin-top: 40px;
}
.opt-area-text {
  text-align: center;
  height: 22px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
  margin-top: 12px;
}
.flex-area {
  display: flex;
  .preview-content {
    width: 330px;
    margin-left: 42px;
    margin-top: 25px;
    .preview-area {
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      border: 1px solid rgba(227, 227, 227, 1);
      padding: 12px 32px;
      height: auto;
      &-title {
        height: 26px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.8);
        line-height: 26px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &-content {
        width: 268px;
        height: 268px;
        background: rgba(250, 250, 250, 1);
        border-radius: 4px;
        margin: 20px 0;
      }
      &-abstract {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        line-height: 22px;
      }
    }
  }
}
.popper-class-image1 {
  padding: 20px !important;
  width: 520px !important;
}
.qz-tooltip-content {
  .tooltip-title {
    height: 20px;
    font-size: 13px;
    font-weight: bold;
    color: #333333;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .tooltip-content {
    display: flex;
    font-size: 12px;
    color: #333333;
    line-height: 20px;
    margin-bottom: 8px;
    .tooltip-little-title {
      display: inline-block;
      width: 70px;
      font-size: 12px;
      font-weight: bold;
      color: #333333;
      line-height: 20px;
    }

    .div-content {
      flex: 1;
    }
  }
}
</style>
