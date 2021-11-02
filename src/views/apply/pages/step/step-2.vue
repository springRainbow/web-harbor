<template>
  <div class="step-2">
    <vue-scroll :style="{ height: `${clientHeight - 320 - top}px` }">
      <h3 class="step-2_tit">填写信息</h3>
      <el-form ref="infoForm" label-width="170px" :model="infoForm" :rules="rules" inline-message>
        <div class="step-2_part">
          <h3 class="step-2_part-tit">账号信息</h3>
          <el-form-item label="轻舟号名称：" prop="tenant.name">
            <el-input
              class="w200"
              v-model.trim="infoForm.tenant.name"
              @blur="validName"
              placeholder="轻舟号名称会对外显示"
              maxlength="40"
              @input="showText = false"
            ></el-input>
            <span v-if="showText && infoForm.tenant.name" class="valid-name-icon" :class="{ error: exists }"
              ><i :class="exists ? 'el-icon-circle-close' : 'el-icon-circle-check'"></i
              >{{ exists ? '该轻舟号名称已存在' : '可以使用' }}</span
            >
          </el-form-item>
          <el-form-item
            label="轻舟号头像："
            ref="logoValid"
            prop="tenant.logo"
            :inline-message="false"
            style="margin-bottom: 26px"
          >
            <apply-upload
              ref="logoUplod"
              class="fl"
              uploadType="logo"
              @success="uploadSuccess"
              @del="deleteUploadFile"
              :size="5242880"
            ></apply-upload>
            <span class="fl upload-tips">图片尺寸建议200*200，文件小于5M</span>
          </el-form-item>
          <el-form-item label="运营专业：" prop="tenant.majors">
            <div>
              <el-radio-group v-model="majorsChose" @change="changeChose('majors')">
                <el-radio :label="1">指定专业</el-radio>
                <el-radio :label="2" :disabled="schoolChose == 2">全部专业</el-radio>
              </el-radio-group>
            </div>
            <div class="cascader-width fl" v-if="majorsChose == 1">
              <el-cascader
                class="w200"
                :placeholder="majorsText.length == 0 ? '按专业选择' : majorsText.join(',')"
                popper-class="majors-cascader"
                v-model="infoForm.tenant.majors"
                :props="prop_major"
                clearable
                :show-all-levels="false"
              >
                <template slot-scope="{ node, data }">
                  <span>{{ data.major_code }}{{ data.major_name }}</span>
                </template>
              </el-cascader>
            </div>
            <span v-if="majorsChose == 1" class="max-tips fl">{{ infoForm.tenant.majors.length }}/50</span>
          </el-form-item>
          <el-form-item label="运营院校：" prop="tenant.schools">
            <div>
              <el-radio-group v-model="schoolChose" @change="changeChose('school')">
                <el-radio :label="1">指定院校</el-radio>
                <el-radio :label="2" :disabled="majorsChose == 2">全部院校</el-radio>
              </el-radio-group>
            </div>
            <div class="cascader-width fl" v-if="schoolChose == 1">
              <el-cascader
                class="w200"
                placeholder="按院校选择"
                v-model="infoForm.tenant.schools"
                :options="schools"
                :props="prop_school"
                clearable
                :show-all-levels="false"
                popper-class="school-cascader"
                filterable
              >
                <template slot-scope="{ node, data }">
                  <span>{{ data.region_name }}</span>
                  <span v-if="node.level == 2">{{ data.school_name }}</span>
                </template>
              </el-cascader>
            </div>
            <span v-if="schoolChose == 1" class="max-tips fl">{{ infoForm.tenant.schools.length }}/50</span>
          </el-form-item>
        </div>
        <div class="step-2_part">
          <h3 class="step-2_part-tit">机构信息</h3>
          <el-form-item label="机构全称：" prop="company.name">
            <el-input
              class="w200"
              v-model.trim="infoForm.company.name"
              placeholder="请输入机构或公司全称"
              maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="营业执照代码：" prop="company.certificate_code">
            <el-input
              class="w200"
              placeholder="请输入营业执照代码"
              v-model.trim="infoForm.company.certificate_code"
              maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" :inline-message="false" ref="picValid" prop="company.certificate_picture">
            <apply-upload
              ref="cpUpload"
              class="fl"
              uploadType="certificate_picture"
              @success="uploadSuccess"
              @del="deleteUploadFile"
              :preview="true"
              :size="20971520"
            ></apply-upload>
            <span class="fl upload-tips w200">请上传清晰的工商营业执照彩色扫描件或照片，文件小于20M</span>
          </el-form-item>
          <el-form-item label="联系人：" prop="company.contact_name">
            <el-input
              class="w200"
              v-model.trim="infoForm.company.contact_name"
              placeholder="请输入联系人姓名"
              maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人电话：" prop="company.contact_phone">
            <el-input
              class="w200"
              v-model.trim="infoForm.company.contact_phone"
              placeholder="请输入联系人电话"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </vue-scroll>
    <el-checkbox class="agree" v-model="isagree">已阅读并同意</el-checkbox
    ><span
      class="agreement-text"
      :style="{ color: isagree ? '#15cfdc' : 'rgba(0, 0, 0, 0.4)' }"
      @click.stop="showAgreement"
      >《轻舟机构号隐私协议》</span
    >
    <div>
      <el-button class="ml32" plain @click="nextStep('1')">{{ $route.query.u ? '返回' : '上一步' }}</el-button>
      <el-button type="primary" :disabled="!isagree" @click="submitApply" :loading="btnLoading">提交审核</el-button>
    </div>
    <el-drawer title="" :visible.sync="drawer" append-to-body size="60%">
      <div class="step-2_agreement" v-html="agreement"></div>
    </el-drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import api from '../../_api';
import applyUpload from '@/components/applyUpload/upload.vue';
let getMajors = async function (_data) {
  let res = await api.getCompMajors(_data);
  if (res.status == 200) {
    return res.result;
  }
};
export default {
  name: 'Step2',
  data() {
    const checkSchool = (rule, value, callback) => {
      if (this.schoolChose == 1 && value == '') {
        return callback(new Error('请选择运营院校'));
      } else if (value.length > 50) {
        return callback(new Error('最多选择50个运营院校'));
      } else {
        callback();
      }
    };
    const checkMajors = (rule, value, callback) => {
      if (this.majorsChose == 1 && value == '') {
        return callback(new Error('请选择运营专业'));
      } else if (value.length > 50) {
        return callback(new Error('最多选择50个运营专业'));
      } else {
        callback();
      }
    };
    const checkMobile = (rule, value, callback) => {
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (value == '') {
        return callback(new Error('请输入联系人电话'));
      } else if (!reg.test(value)) {
        return callback(new Error('手机号格式不正确'));
      } else {
        callback();
      }
    };
    const checkName = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      const eomjireg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
      if (!reg.test(value) && !eomjireg.test(value)) {
        return callback(new Error('格式不正确，仅支持汉字、字母、数字'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        'tenant.name': [
          { required: true, message: '请输入轻舟号名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        'company.name': [
          { required: true, message: '请输入机构或公司全称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        'tenant.logo': [{ required: true, message: '请上传轻舟号头像', trigger: 'change' }],
        'tenant.schools': [{ validator: checkSchool, required: true, trigger: 'change' }],
        'tenant.majors': [{ validator: checkMajors, required: true, trigger: 'change' }],
        'company.certificate_picture': [{ required: true, message: '请上传营业执照', trigger: 'change' }],
        'company.certificate_code': [
          { required: true, message: '请输入营业执照代码', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        'company.contact_name': [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        'company.contact_phone': [{ validator: checkMobile, required: true, trigger: 'blur' }]
      },
      majorsChose: 1, // 1 指定专业 2 全部专业
      schoolChose: 1, // 1 指定院校 2全部院校
      majorsText: [],
      isagree: false,
      exists: false,
      showText: false,
      btnLoading: false,
      drawer: false,
      agreement: '',
      top: 0,
      typeData: {},
      infoForm: {
        tenant: {
          logo: '', // 轻舟号logo
          name: '', //轻舟号名称
          majors: [], // 运营专业，全部为[]
          schools: [], // 运营院校，全部为[]
          type_id: 1
        },
        company: {
          name: '', // 机构全称
          contact_name: '', // 联系人姓名
          contact_phone: '', // 联系人电话
          certificate_code: '', // 执照代码
          certificate_picture: '' // 执照图片
        }
      },
      prop_school: {
        value: 'id',
        label: 'school_name',
        multiple: true,
        emitPath: false,
        checkStrictly: false,
        children: 'school'
      },
      schools: [],
      prop_major: {
        value: 'id',
        label: 'major_name',
        emitPath: false,
        lazy: true,
        multiple: true,
        checkStrictly: false,
        lazyLoad(node, resolve) {
          let _data = {
            parent: 0,
            level: node.level + 1,
            _s: new Date().getTime()
          };
          if (node.level > 0) {
            _data.parent = node.data.id;
          }

          if (node.level <= 3) {
            getMajors(_data).then((data) => {
              if (node.level == 3) {
                data.forEach((item) => {
                  item.leaf = true;
                });
              }
              resolve(data);
            });
          } else {
            resolve();
          }
        }
      }
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
  beforeCreate() {
    if (!sessionStorage.getItem('clickAgree')) {
      this.$message.error('请阅读并同意《轻舟号服务协议》');
      this.$router.push({
        name: 'applyProcess',
        params: {
          step: 1
        },
        query: { ...this.$route.query }
      });
    }
  },
  created() {
    this.getSchooles();
    if (this.$route.query.u) {
      this.getHarborDetail();
    }
  },
  methods: {
    // 获取轻舟号详情，编辑
    async getHarborDetail() {
      const res = await api.getHarborDetail({
        uuid: this.$route.query.u
      });
      if (res.status == 200) {
        const data = res.result.tenant;
        let schools = [];
        let majors = [];
        // 头像数据回显
        this.$refs.logoUplod.ossOpt.fileList = [
          {
            src: data.logo_url,
            isUpload: true
          }
        ];
        // 营业执照数据回显
        this.$refs.cpUpload.getTokenPic(data.company.certificate_picture);
        if (data.majors.length) {
          data.majors.forEach((el) => {
            majors.push(el.id);
            this.majorsText.push(el.major_name);
          });
        } else {
          this.majorsChose = 2;
        }
        if (data.schools.length) {
          data.schools.forEach((el) => {
            schools.push(el.id);
          });
        } else {
          this.schoolChose = 2;
        }
        this.infoForm = {
          tenant: {
            logo: data.logo, // 轻舟号logo
            name: data.name, //轻舟号名称
            majors: majors, // 运营专业，全部为[]
            schools: schools, // 运营院校，全部为[]
            type_id: data.type_id
          },
          company: {
            name: data.company.name, // 机构全称
            contact_name: data.company.contact_name, // 联系人姓名
            contact_phone: data.company.contact_phone, // 联系人电话
            certificate_code: data.company.certificate_code, // 执照代码
            certificate_picture: data.company.certificate_picture // 执照图片
          }
        };
        this.typeData = data.type;
        this.$emit('editData', res.result.tenant);
      }
    },
    nextStep(step) {
      sessionStorage.removeItem('clickAgree');
      // 如果是编辑，上一步跳转到列表
      if (this.$route.query.u) {
        this.$router.push({
          name: 'apply'
        });
      } else {
        this.$emit('nextStep', step);
      }
    },
    // 提交申请
    submitApply() {
      this.btnLoading = true;
      this.$refs.infoForm.validate((valid) => {
        if (valid && !this.exists) {
          this.postCreateHarbor();
        } else {
          this.btnLoading = false;
        }
      });
    },
    async getSchooles() {
      const res = await api.getCompSchool();
      this.schools = res.result;
    },
    // 切换radio
    changeChose(type) {
      if (type == 'majors' && this.majorsChose == 2) {
        this.schoolChose = 1;
        this.infoForm.tenant.majors = [];
      }
      if (type == 'school' && this.schoolChose == 2) {
        this.majorsChose = 1;
        this.infoForm.tenant.schools = [];
      }
    },
    // 提交轻舟号
    async postCreateHarbor() {
      let axiosPost = null;
      let params = JSON.parse(JSON.stringify(this.infoForm));
      if (this.$route.query.u) {
        params.tenant.uuid = this.$route.query.u;
        axiosPost = api.postUpdateHarbor(params);
      } else {
        params.tenant.type_id = this.$route.query.type;
        axiosPost = api.postCreateHarbor(params);
      }
      const res = await axiosPost;
      if (res.status == 200) {
        this.$alert('<div class="submit-apply-bg"><h3>提交成功</h3>我们会在 3 个工作日内对您的资料进行审核</div>', '', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          center: true,
          confirmButtonText: '好的'
        }).then(() => {
          this.$router.push({
            name: 'apply'
          });
        });
      } else {
        this.$message.error(res.message);
      }
      this.btnLoading = false;
    },
    // 验证轻舟号名称
    async validName() {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      if (this.infoForm.tenant.name != '' && reg.test(this.infoForm.tenant.name)) {
        const res = await api.getValidName({
          name: this.infoForm.tenant.name
        });
        if (res.status == 200) {
          this.showText = true;
          this.exists = res.result.exists;
        }
      }
    },
    // 上传图片成功
    uploadSuccess(data) {
      if (data.type == 'logo') {
        this.infoForm.tenant.logo = data.file;
        this.$refs.logoValid.clearValidate();
      } else {
        this.infoForm.company.certificate_picture = data.file;
        this.$refs.picValid.clearValidate();
      }
    },
    // 删除图片
    deleteUploadFile(type) {
      if (type == 'logo') {
        this.infoForm.tenant.logo = '';
      } else {
        this.infoForm.company.certificate_picture = '';
      }
    },
    showAgreement() {
      this.agreement = this.typeData.privacy_agreement || JSON.parse(sessionStorage.getItem('agreement')).privacy;
      this.drawer = true;
    }
  }
};
</script>
<style lang="css">
.majors-cascader .el-cascader-panel .el-cascader-menu:nth-child(-n + 2) .el-checkbox {
  display: none;
}
.school-cascader .el-cascader-panel .el-cascader-menu:nth-child(1) .el-checkbox {
  display: none;
}
</style>
<style lang="scss">
.submit-apply-bg {
  height: 180px;
  background: url('~@/assets/icon-success.png') no-repeat center top;
  background-size: 80px 80px;
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
  box-sizing: border-box;
  padding-top: 100px;
  h3 {
    font-weight: bold;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 8px;
  }
}
</style>
<style lang="scss" scoped>
.step-2 {
  h3 {
    font-weight: normal;
  }
  &_agreement {
    padding: 0 32px 32px 32px;
  }
  .agreement-text {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.4);
    font-weight: bold;
    &:hover {
      color: $mainColor !important;
      text-decoration: underline;
    }
  }
  .majors-text {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 12px;
    box-sizing: border-box;
    padding: 2px 6px;
    max-height: 200px;
    overflow-y: auto;
    position: relative;
    line-height: normal;
    span {
      display: inline-block;
      margin-bottom: 4px;
    }
    .arrow-down {
      position: absolute;
      right: 10px;
      font-size: 14px;
      color: #c0c4cc;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .max-tips {
    color: rgba(0, 0, 0, 0.2);
    margin-left: 12px;
  }
  .cascader-width {
    min-height: 40px;
    max-height: 124px;
    overflow-x: hidden;
  }
  .agree {
    margin-left: 32px;
  }
  .upload-tips {
    padding-top: 92px;
    color: rgba(0, 0, 0, 0.2);
    margin-left: 10px;
    line-height: normal;
    &.w200 {
      padding-top: 76px;
    }
  }
  .valid-name-icon {
    color: #67c23a;
    i {
      margin: 0 4px 0 12px;
    }
    &.error {
      color: #f56c6c;
    }
  }
  &_tit {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 32px;
    margin-bottom: 32px;
  }
  &_part {
    margin-bottom: 32px;
    &-tit {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 26px;
      padding-left: 36px;
      margin-bottom: 16px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 100%;
        left: 0;
        background: $mainColor;
        border-radius: 4px;
      }
    }
    /deep/.el-form-item__label {
      font-weight: bold;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
