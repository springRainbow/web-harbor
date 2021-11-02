<!--
*
* 建联卡片
*
-->
<template>
  <div v-if="show">
    <div class="consult-card">
      <div class="card-title-area">
        <span class="card-title">插入{{ showType.name }}建联卡片</span>
        <!-- 005航班中设计稿去掉了所有提示，因此注释 -->
        <!-- <span class="card-tips">（{{ showType.tips }}）</span> -->
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        label-position="left"
        class="demo-ruleForm"
      >
        <el-form-item label="卡片样式：" style="font-weight: bold; font-size: 16px">
          <el-radio-group v-model="ruleForm.card_type" @change="clearValidate">
            <el-radio :label="2">纯图片卡片</el-radio>
            <el-radio :label="1">文字卡片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传图片" v-if="ruleForm.card_type == 2" prop="card_logo" :required="true">
          <div
            class="z-item upload-btn"
            @click="showMaterialDialog('card_logo')"
            style="width: 160px; height: 90px; text-align: center"
          >
            <div v-if="!ruleForm.card_logo">
              <img src="~@/assets/add@2x.png" class="add-pic" alt="" />
              <p class="upload-qrcode" style="left: 57px">上传图片</p>
            </div>
            <img
              v-else
              :src="`${ruleForm.card_logo.includes('.com/') ? '' : '//image.kmf.com/'}${ruleForm.card_logo}`"
              class=""
              alt=""
              style="vertical-align: middle; max-width: 100%; max-height: 100%"
            />
          </div>
          <span class="new-tips new-tips-right">该图片会在内容中显示<br />建议尺寸：670*260px</span>
        </el-form-item>
        <el-form-item label="填写引导语：" v-if="ruleForm.card_type == 1" prop="guidance_document" :required="true">
          <el-input
            v-model="ruleForm.guidance_document"
            type="textarea"
            :rows="2"
            :maxlength="20"
            :placeholder="showType.placeholder"
          ></el-input>
        </el-form-item>
        <p class="jl-info">建联信息</p>
        <el-form-item
          v-for="item in showType.formList"
          :key="item.prop"
          :label="`${item.label}：`"
          :prop="item.prop"
          :required="item.required"
        >
          <template v-if="item.type === 'text'">
            <el-input v-model="ruleForm[item.prop]" :maxlength="item.maxlength"></el-input>
            <p class="new-tips">{{ item.new_tip || '' }}</p>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select
              v-model="ruleForm[item.prop]"
              filterable
              remote
              reserve-keyword
              placeholder="请输入规则标识"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="`${item.product.name}/${item.alias}`"
                :value="item.alias"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <div class="z-item upload-btn" @click="showMaterialDialog()">
              <!-- <input type="file" class="hidden-file" @change="upLoad" ref="uploadRef" /> -->
              <div v-if="!ruleForm[item.prop]">
                <img src="~@/assets/add@2x.png" class="add-pic" alt="" />
                <p class="upload-qrcode">上传二维码</p>
              </div>
              <img
                v-else
                :src="`${ruleForm[item.prop].includes('.com/') ? '' : '//image.kmf.com/'}${ruleForm[item.prop]}`"
                class=""
                alt=""
                style="width: 100%"
              />
            </div>
            <span class="new-tips new-tips-right">建议上传单独的二维码图片</span>
          </template>
        </el-form-item>
        <el-form-item v-if="ruleForm.type === 'qq' || ruleForm.type === 'qqGroup'">
          <span class="form-tip-before">
            使用QQ会话链接后，用户点击卡片可直接打开QQ，并进入QQ聊天页面<br />
            QQ会话链接仅支持输入QQ会话链接地址<br />
            QQ会话链接获取方式：</span
          ><span class="form-tip" @click="openMeetingTip">点击查看</span>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button plain @click="cancal" size="mini">取消</el-button>
          <el-button type="primary" @click="submit" size="mini">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="m-modal"></div>
    <!-- 上传选择素材库 -->
    <MaterialImage ref="materialDialog" @submitSucceed="submitSucceed"></MaterialImage>
  </div>
</template>
<script>
import conf from './card.conf';
import api from '../../../_api';
import MaterialImage from './MaterialImage';

export default {
  data() {
    return {
      ruleForm: {},
      show: false,
      cardConfig: conf,
      showType: {},
      rules: {},
      old_guidance_document: '',
      options: [],
      loading: false
    };
  },
  components: {
    MaterialImage
  },
  props: {
    contact_card: {}
  },
  created() {},
  methods: {
    cancal() {
      this.show = false;
      this.$emit('cancal');
    },
    upLoad() {},
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let form = this.ruleForm;
          if (
            ((form.type == 'qq' || form.type == 'qqGroup') && !form.qq_no && !form.qr_code && !form.link) ||
            ((form.type == 'public' || form.type == 'wechat') && !form.wechat_no && !form.qr_code) ||
            (form.type == 'wechatGroup' && !form.qr_code)
          ) {
            this.$message.error('请至少完成一项建联信息输入才可成功插入卡片');
            return false;
          }
          this.$emit('insertCard', { ...form, ...{ old_guidance_document: this.old_guidance_document } });
          this.show = false;
        }
      });
    },
    showMaterialDialog(type) {
      this.$refs.materialDialog.showMaterialDialog(type);
    },
    submitSucceed({ info, type }) {
      if (type === 'card_logo') {
        this.ruleForm.card_logo = info.file_path;
        this.clearValidate();
      } else {
        this.ruleForm.qr_code = info.file_path;
      }
    },
    openMeetingTip() {
      window.open(location.protocol + '//' + location.host + '/meeting/meetingtip?u=' + this.$route.query.u, '_blank');
    },
    async remoteMethod(query) {
      this.loading = true;
      let res = await api.getAllocateRule(query);
      console.log(res);
      this.options = res.result.data || [];
      this.loading = false;
    },
    //切换类型clearValidate
    clearValidate() {
      this.$refs.ruleForm.clearValidate();
    }
  },
  watch: {
    contact_card: {
      handler(newVal, oldVal) {
        // contact_card发生变化重新渲染卡片
        if (newVal.type) {
          console.log(newVal);
          // 判断传进来的有没有引导文案，有代表是编辑，记录下原来的引导文案
          if (newVal && newVal.guidance_document) {
            this.old_guidance_document = newVal.guidance_document;
          } else {
            this.old_guidance_document = '';
          }
          let val = this.cardConfig[newVal.type];
          let form = {
            type: newVal.type,
            card_logo: '',
            card_type: 1
          };
          if (newVal.id) {
            form.id = newVal.id;
            form.card_logo = newVal.card_logo || '';
            form.card_type = newVal.card_type || 1;
            form.guidance_document = newVal.guidance_document;
          }
          val.formList.forEach((element) => {
            form[element.prop] = newVal[element.prop] || '';
          });
          this.ruleForm = form;

          this.rules = {
            ...{
              guidance_document: [{ required: true, message: '请输入引导文案' }],
              allot_rule: [{ required: true, message: '请输入crm分配规则标识' }],
              card_logo: [{ required: true, message: '尚未上传图片' }]
            },
            ...val.rules
          };
          this.$forceUpdate();
          this.showType = val;
          this.show = true;
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
@import './card.scss';
.jl-info {
  height: 26px;
  font-size: 14px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.6);
  line-height: 26px;
  margin: 24px 0;
}
.new-tips {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.2);
  &-right {
    position: absolute;
    top: -8px;
    margin-left: 16px;
  }
}
.consult-card {
  width: 656px;
}
.demo-ruleForm {
  /deep/.el-input,
  /deep/.el-textarea__inner {
    width: 400px;
  }
}

.card-title-area {
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 20px;
}
</style>
