<!--
*
* 视频建联卡片
*
-->
<template>
  <div>
    <div class="video-consult-card">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-ruleForm">
        <el-form-item label="咨询方式：" required="">
          <el-select
            class="tags-select"
            v-model="form.type"
            placeholder="请选择"
            @change="typeChange"
            style="width: 177px"
          >
            <el-option :label="tag.name" :value="tag.id" v-for="tag in config" :key="tag.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="item in showTypeList"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :required="item.required"
        >
          <el-input v-model="form[item.prop]" v-if="item.type === 'text'" style="width: 177px"></el-input>
          <el-select
            v-else-if="item.type == 'select'"
            v-model="form[item.prop]"
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
          <div class="z-item upload-btn" v-else @click="showMaterialDialog()">
            <div v-if="!form[item.prop]">
              <img src="~@/assets/add@2x.png" class="add-pic" alt="" />
              <p class="upload-qrcode">上传二维码</p>
            </div>
            <div v-else>
              <img
                :src="`${form[item.prop].includes('.com/') ? '' : '//image.kmf.com/'}${form[item.prop]}`"
                class=""
                alt=""
                style="width: 100%"
              />
            </div>
          </div>
          <!-- <el-input v-model="ruleForm.name" v-if="item.type==='text'"></el-input> -->
        </el-form-item>
        <el-form-item v-if="form.type === 'qq' || form.type === 'qqGroup'">
          <span class="form-tip-before"
            >备注：仅支持输入{{ form.type == 'qq' ? 'qq会话' : 'qq群' }}链接地址，请勿输入汉字。<br />{{
              form.type == 'qq' ? '会话' : 'qq群'
            }}链接获取方式：</span
          ><span class="form-tip" @click="openMeetingTip">点击查看。</span>
        </el-form-item>
      </el-form>
    </div>
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
      form: {
        type: ''
      },
      showTypeList: [],
      rules: {},
      config: [
        { id: 'public', name: '公众号' },
        { id: 'wechat', name: '微信' },
        { id: 'qq', name: 'QQ' },
        { id: 'wechatGroup', name: '微信群' },
        { id: 'qqGroup', name: 'QQ群' }
      ],
      options: [],
      loading: false
    };
  },
  props: {
    is_official: Boolean
  },
  components: {
    MaterialImage
  },
  created() {},
  methods: {
    typeChange(id, isDe) {
      let val = JSON.parse(JSON.stringify(conf[id]));
      let form = {
        type: id
      };
      val.formList.unshift({
        type: 'text',
        label: '引导文案',
        prop: 'guidance_document',
        required: true,
        maxlength: 20
      });
      this.showTypeList = val.formList;
      if (!isDe) {
        val.formList.forEach((element) => {
          form[element.prop] = this.form[element.prop] || '';
        });
        this.form = form;
      }

      this.rules = {
        ...{
          guidance_document: [{ required: true, message: '请输入引导文案' }],
          allot_rule: [{ required: true, message: '请输入crm分配规则标识' }]
        },
        ...val.rules
      };
      this.$forceUpdate();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
      });
    },
    submitSucceed({ info }) {
      this.form.qr_code = info.file_path;
    },
    showMaterialDialog() {
      this.$refs.materialDialog.showMaterialDialog(0);
    },
    getVideoConsultCardInfo() {
      if (this.form.type == '') return [];
      console.log(this.form);
      let stauts = '';
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          if (
            ((form.type == 'qq' || form.type == 'qqGroup') && !form.qq_no && !form.qr_code && !form.link) ||
            ((form.type == 'public' || form.type == 'wechat') && !form.wechat_no && !form.qr_code) ||
            (form.type == 'wechatGroup' && !form.qr_code)
          ) {
            this.$message.error('请至少完成一项建联信息输入才可成功插入卡片');
            return false;
          }
          if (form.qr_code) {
            form.qr_code = form.qr_code.split('/')[form.qr_code.split('/').length - 1];
          }
          stauts = [form];
        } else {
          status = false;
        }
      });

      return stauts;
    },
    setVideoConsultCardInfo(result) {
      if (result.contact_card.length) {
        let data = result.contact_card[0];
        if (data.type == 'miniProgram' && !data.hasOwnProperty('allot_rule')) {
          //兼容处理老数据 如果小程序建联没有allot_rule字段，也就是没有规则时，需要设置默认值
          data.allot_rule = '';
        }
        this.form = data;
        this.typeChange(this.form.type, true);
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
    }
  },

  watch: {
    is_official(newval) {
      if (newval && this.config.length === 5) {
        this.config.push({ id: 'miniProgram', name: '小程序' });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.6);
}
@import './card.scss';
</style>
