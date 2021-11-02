<template>
  <div class="info">
    <div class="info-base g-clearfix">
      <div class="fl">
        <apply-upload
          ref="logoUplod"
          class="fl"
          uploadType="logo"
          @success="uploadSuccess"
          :list="tenant.logo_url"
          :size="5242880"
        ></apply-upload>
      </div>
      <div class="fl ml12">
        <h3>
          <i :title="tenant.name">{{ tenant.name }}</i>
        </h3>
        <div v-if="tenant.founder">
          <p>申请手机号：{{ tenant.founder.user.phone }}</p>
          <p>创建时间：{{ tenant.created_at }}</p>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="info-content">
      <div class="info-content_tab">
        <span @click="changeTag('1')" :class="{ active: tab == 1 }">机构介绍</span>
        <span @click="changeTag('2')" :class="{ active: tab == 2 }">认证信息</span>
      </div>
      <vue-scroll :style="{ height: `${clientHeight - 320}px` }">
        <div class="info-content_main" v-if="tab == 1">
          <h3>
            机构介绍
            <em
              v-if="!showTextarea"
              class="fr info-content_icon"
              @click="(showTextarea = true), (introduction = tenant.introduction)"
              ><i class="el-icon-edit"></i>编辑</em
            >
          </h3>
          <div class="info-content_intro" v-if="!showTextarea">{{ tenant.introduction || '暂无介绍' }}</div>
          <div class="info-content_intro" v-if="showTextarea">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入内容"
              v-model.trim="introduction"
              maxlength="500"
              show-word-limit
            >
            </el-input>
            <div class="intro-btn">
              <el-button plain size="mini" @click="(showTextarea = false), (introduction = '')">取消</el-button>
              <el-button type="primary" size="mini" @click="updateIntro">确定</el-button>
            </div>
          </div>
          <h3>擅长领域 <span>最多可添加5个</span></h3>
          <div class="info-content_tag">
            <el-tag
              :key="tagIndex"
              v-for="(tag, tagIndex) in specialties"
              closable
              size="medium"
              :disable-transitions="false"
              @close="handleClose(tag)"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="w200"
              v-if="inputVisible"
              v-model="tagValue"
              ref="saveTagInput"
              @keyup.enter.native="$event.target.blur"
              @blur="handleInputConfirm"
              maxlength="20"
              show-word-limit
            >
            </el-input>
            <el-button type="text" v-else icon="el-icon-circle-plus-outline" @click="showInput" size="medium"
              >添加</el-button
            >
          </div>
        </div>
        <div class="info-content_main" v-if="tab == 2">
          <h3>机构信息</h3>
          <el-form v-if="tenant.company" class="ml45" label-width="130px" label-position="left">
            <el-form-item label="机构全称：" class="is-required">{{ tenant.company.name }}</el-form-item>
            <el-form-item label="营业执照代码：" class="is-required">{{
              tenant.company.certificate_code
            }}</el-form-item>
            <el-form-item label="营业执照：" class="is-required">
              <div class="cerpic" v-loading="imgLoading">
                <img @click="previewImg(certificate_pic)" :src="certificate_pic" alt="" />
              </div>
            </el-form-item>
            <el-form-item label="联系人：" class="is-required">
              {{ tenant.company.contact_name }}
            </el-form-item>
            <el-form-item label="联系电话：" class="is-required">
              {{ phone == '' ? tenant.company.contact_phone : phone }}
              <el-button v-if="phone == ''" :loading="phoneLoading" type="text" @click="showPhone">查看</el-button>
            </el-form-item>
          </el-form>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import api from '../_api';
import applyUpload from '@/components/applyUpload/upload.vue';
export default {
  name: 'HarborInfo',
  data() {
    return {
      tenant: {},
      tagValue: '',
      inputVisible: false,
      tab: 1,
      showTextarea: false,
      introduction: '',
      specialties: [],
      certificate_pic: '',
      imgLoading: false,
      phone: '',
      phoneLoading: false
    };
  },
  components: {
    applyUpload
  },
  computed: {
    ...mapState({
      clientHeight: (state) => state.common.clientHeight
    })
  },
  created() {
    this.getHarborDetail();
  },
  methods: {
    // 上传图片成功
    uploadSuccess(data) {
      this.tenant.logo_url = `${data.file.domain}/${data.file.full_url}`;
      this.updateInfo({
        tenant: {
          uuid: localStorage.getItem('HARBOR_ID'),
          logo: data.file.file
        }
      });
    },

    async getHarborDetail() {
      const res = await api.getHarborDetail({
        uuid: localStorage.getItem('HARBOR_ID')
      });
      this.tenant = res.result.tenant;
      this.introduction = res.result.tenant.introduction;
      this.specialties = res.result.tenant.specialties || [];
    },
    updateIntro() {
      this.updateInfo({
        tenant: {
          uuid: localStorage.getItem('HARBOR_ID'),
          introduction: this.introduction
        }
      });
    },
    // 更新轻舟号信息
    async updateInfo(params) {
      const res = await api.postUpdateHarbor(params);
      if (res.status == 200) {
        if (params.tenant.introduction) {
          this.tenant.introduction = params.tenant.introduction;
          this.showTextarea = false;
        }
      } else {
        this.$message.error(res.message);
      }
    },
    changeTag(tab) {
      this.tab = tab;
      if (tab == 2 && this.certificate_pic == '') {
        this.getTokenPic(this.tenant.company.certificate_picture);
      }
    },
    // 删除tag
    handleClose(tag) {
      this.specialties.splice(this.specialties.indexOf(tag), 1);
      this.updateInfo({
        tenant: {
          uuid: localStorage.getItem('HARBOR_ID'),
          specialties: this.specialties
        }
      });
    },
    previewImg(url) {
      this.$alert(`<img style="max-height:600px" src="${url}">`, '预览', {
        dangerouslyUseHTMLString: true,
        customClass: 'view-img',
        showConfirmButton: false,
        closeOnClickModal: true,
        showClose: false
      })
        .then(() => {})
        .catch(() => {});
    },
    // 新增
    async handleInputConfirm() {
      let tagValue = this.tagValue;
      if (tagValue != '') {
        if (this.specialties.indexOf(tagValue) > -1) {
          this.$message.error('已设置该领域');
        } else {
          this.updateInfo({
            tenant: {
              uuid: localStorage.getItem('HARBOR_ID'),
              specialties: this.specialties
            }
          });
          this.specialties.push(tagValue);
          this.inputVisible = false;
          this.tagValue = '';
        }
      }
    },
    showInput() {
      if (this.specialties.length >= 5) {
        this.$message.error('最多可添加5个');
      } else {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.focus();
        });
      }
    },
    async showPhone() {
      this.phoneLoading = true;
      const res = await api.getPhone({
        uuid: localStorage.getItem('HARBOR_ID')
      });
      if (res.status == 200) {
        this.phone = res.result.phone;
      } else {
        this.$message.error(res.message);
      }
      this.phoneLoading = false;
    },
    // 获取营业执照
    async getTokenPic(file) {
      this.imgLoading = true;
      let _this = this;
      try {
        const res = await api.getCompanyPicture({
          img: file
        });
        var reader = new FileReader();
        reader.onload = function (e) {
          _this.certificate_pic = e.target.result;
        };
        reader.readAsDataURL(res);
      } catch (error) {}

      this.imgLoading = false;
    }
  }
};
</script>
<style lang="css">
.view-img {
  width: auto;
  height: auto;
}
.info-base .my-uplaod-image,
.info-base .upload-area {
  width: 80px !important;
  height: 80px !important;
}
</style>
<style lang="scss" scoped>
.info {
  .line {
    width: 100%;
    height: 20px;
    background: #f4f9fb;
  }
  &-base {
    margin: 26px 32px;
    position: relative;

    img {
      width: 99px;
      height: 99px;
      border-radius: 11px 11px 21px 11px;
    }
    h3 {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.8);
      line-height: 28px;
      margin-bottom: 4px;
      &::after {
        content: '';
        position: absolute;
        width: 54px;
        height: 20px;
        left: -32px;
        top: -26px;
        background: url('~@/assets/icon-info-org.png') no-repeat;
        background-size: 54px 20px;
      }
      i {
        vertical-align: middle;
        display: inline-block;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-style: normal;
      }
      span {
        margin-left: 12px;
      }
    }
    p {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 22px;
      margin-top: 4px;
    }
  }
  &-content {
    &_tab {
      padding: 24px 32px 32px;
      span {
        color: rgba(0, 0, 0, 0.6);
        font-size: 16px;
        margin-right: 24px;
        cursor: pointer;
        position: relative;
        font-weight: bold;
        &.active,
        &:hover {
          color: $mainColor;
          font-weight: bold;
        }
        &.active {
          &::after {
            content: '';
            position: absolute;
            width: 18px;
            height: 9px;
            background: url('~@/assets/tab-active.png') no-repeat;
            background-size: 18px;
            bottom: -15px;
            left: 50%;
            transform: translate(-50%, 0);
          }
        }
      }
    }
    &_main {
      h3 {
        padding-left: 32px;
        box-sizing: border-box;
        margin-bottom: 12px;
        line-height: 22px;
        position: relative;
        &::before {
          content: '';
          width: 4px;
          height: 100%;
          border-radius: 2px;
          background: $mainColor;
          position: absolute;
          left: 0;
        }
        span {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.4);
          margin-left: 8px;
        }
      }
      /deep/.el-form-item__label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
      }
      .cerpic {
        width: 160px;
        min-height: 160px;
        img {
          width: 160px;
        }
      }
    }
    &_intro {
      padding: 24px 32px;
      margin: 0 32px;
      background: rgba(247, 252, 253, 1);
      border-radius: 8px 8px 40px 8px;
      margin-bottom: 24px;
      color: rgba(0, 0, 0, 0.6);
      .intro-btn {
        margin-top: 12px;
        text-align: right;
      }
    }
    &_tag {
      margin-left: 32px;
      /deep/.el-tag {
        margin-right: 12px;
        font-size: 14px;
      }
    }
    &_icon {
      color: $mainColor;
      font-size: 14px;
      margin-right: 32px;
      cursor: pointer;
    }
  }
}
</style>
