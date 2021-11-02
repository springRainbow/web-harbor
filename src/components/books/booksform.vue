<template>
  <el-drawer v-bind="$attrs" :show-close="false" v-on="$listeners" class="books_form" ref="drawer">
    <div class="demo-drawer__content">
      <!-- 参考书表单 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="padding: 0 30px 0 20px">
        <el-form-item prop="name" :error="err_bookname" label="书名：" :label-width="formLabelWidth">
          <span style="font-size: 12px; color: #999" v-if="editType == 1">
            <i style="color: #faad14; margin-right: 5px" class="el-icon-warning"></i
            >书名作为书籍的唯一标识，创建成功后无法修改
          </span>
          <el-input
            v-model="ruleForm.name"
            :disabled="editType == 2"
            maxlength="100"
            placeholder="请填写书名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item required prop="loadedImg" :error="imgErr" label="封面图：" :label-width="formLabelWidth">
          <input type="hidden" v-model="ruleForm.loadedImg" />
          <span style="font-size: 12px; color: #999">
            <i style="color: #faad14; margin-right: 5px" class="el-icon-warning"></i>图片宽高比3:4，不同比例可能显示不全
          </span>
          <oss-upload
            style="margin-top: -16px"
            :options="FileOptions"
            @uploadSuccess="uploadSuccess"
            @uploadFailed="uploadFailed"
            @uploadError="uploadError"
            @file-delete="deleteUploadFile"
            ref="filesEle"
          ></oss-upload>
        </el-form-item>
        <el-form-item required prop="author" :error="err_auth" label="作者：" :label-width="formLabelWidth">
          <el-input
            :disable="editType == 2"
            v-model="ruleForm.author"
            maxlength="50"
            placeholder="请填写作者姓名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item required prop="description" :error="err_detail" label="简介：" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="ruleForm.description"
            maxlength="200"
            show-word-limit
            rows="4"
            placeholder="请填写书的简单描述"
            resize="none"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="适用范围：" class="form_label_w" :label-width="formLabelWidth">
          <p v-if="resTags.length == 0" style="color: rgba(0, 0, 0, 0.4)">添加即代表该本书适用于所选院校专业的备考</p>
          <el-tag
            v-for="(tag, index) in resTags"
            :key="tag.id"
            :closable="tag.tenant_uuid == uuid && resTags.length > 0"
            style="margin-right: 10px"
            @close="removeTag(tag, index)"
            >{{ tag.school_name }}-{{ tag.major_name }}</el-tag
          >
          <div class="switch_outer" v-show="editType == 2">
            <el-switch
              style="display: block; color: #999; float: left"
              v-model="addTagSwitch"
              active-text="添加院校/专业"
            ></el-switch>
          </div>
        </el-form-item>
        <transition name="el-zoom-in-top">
          <div class="transition-box" v-show="editType == 1 || addTagSwitch">
            <el-form-item prop="major" label="专业：" :label-width="formLabelWidth">
              <el-select
                v-if="SchoolMajor.majors.length"
                v-model="ruleForm.major"
                style="width: 100%"
                multiple
                filterable
                :multiple-limit="50"
                placeholder="请点击选择或搜索适用专业"
              >
                <el-option
                  v-for="(item, index) in SchoolMajor.majors"
                  :key="index"
                  :label="item.major_code + ' ' + item.major_name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <major-select
                v-else
                :limit="50"
                multiple
                :include_second="0"
                :include_third="1"
                style="width: 100%"
                v-on:change-edit="majorChange"
              ></major-select>
            </el-form-item>
            <!-- 当前机构下的院校 -->
            <el-form-item prop="school" label="院校：" :label-width="formLabelWidth">
              <el-select
                v-if="SchoolMajor.schools.length"
                v-model="ruleForm.school"
                style="width: 100%"
                multiple
                :multiple-limit="50"
                filterable
                placeholder="请点击选择或搜索适用院校"
              >
                <el-option
                  v-for="(item, index) in SchoolMajor.schools"
                  :key="index"
                  :label="item.school_name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <school-select
                v-else
                multiple
                style="width: 100%"
                :limit="50"
                v-on:change-edit="schoolChange"
              ></school-select>
            </el-form-item>
          </div>
        </transition>
      </el-form>
      <div class="demo-drawer__footer" style="margin: 40px">
        <el-button round @click="cancelForm" size="mini">取 消</el-button>
        <el-button size="mini" type="primary" style="margin-left: 12px" @click="handleClose" round :loading="loading">{{
          loading ? '提交中 ...' : '确 定'
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import api from '@/views/content/_api.js';
import majorSelect from '@/components/books/majorselect.vue';
import schoolSelect from '@/components/books/schoolselect.vue';
export default {
  name: 'booksForm',
  props: {
    editType: [String, Number], //1新建 2编辑
    bookId: [String, Number], //参考书id
    SchoolMajor: {
      //经营范围内的院校专业
      type: [String, Array, Object],
      default: {
        majors: [],
        schools: []
      }
    }
  },
  components: {
    majorSelect,
    schoolSelect
  },
  data() {
    //书名校验与书库名称对比唯一
    let checkBookName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写书名'));
      }
      let res = this.bookNameUnique(value).then(function (ren) {
        if (!ren) {
          callback(new Error('该本书已存在，去列表中找出来直接添加评语吧～'));
        } else {
          callback();
        }
      });
    };

    return {
      addTagSwitch: false, //添加适用范围开关
      uuid: [], //当前登录用户id
      resTags: [], //适用范围
      err_bookname: '', //名称敏感词
      err_auth: '', //作者敏感词
      err_detail: '', //描述敏感词
      imgErr: '', //封面图违规

      /**
       * 表单数据
       */
      ruleForm: {
        name: '',
        loadedImg: [],
        author: '',
        description: '',
        major: [],
        school: []
      },

      /**
       * 表单校验规则
       */

      rules: {
        name: [{ validator: checkBookName, trigger: 'blur', required: true }],
        loadedImg: [{ required: true, message: '请上传封面图' }],
        author: [{ required: true, message: '请填写作者姓名' }],
        description: [{ required: true, message: '请填写书的简单描述' }],
        major: [{ required: true, message: '请选择适用专业', trigger: 'change' }],
        school: [{ required: true, message: '请选择适用学校', trigger: 'change' }]
      },
      loading: false,
      formLabelWidth: '100px',
      timer: null,

      /**
       * 设置上传组件配置项
       */

      FileOptions: {
        parameters: {
          authkey: '',
          product_line: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp',
          space: 'kmf-image',
          subject: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp'
        },
        types: ['jpg', 'jpeg', 'png'],
        maxSize: 2048000,
        multiple: true,
        overReplace: true,
        maxLength: 1,
        fileList: []
      }
    };
  },
  watch: {
    /**
     * 监听参考书id
     */

    bookId(n, m) {
      if (n != m && this.editType == 2) {
        this.getBookDetail();
      }
    }
  },
  created() {
    this.uuid = window.localStorage.getItem('HARBOR_ID');
    this.rules.major[0].required = this.rules.school[0].required = this.editType == 2 ? false : true;
  },
  mounted() {
    console.log(this.SchoolMajor);
  },
  methods: {
    /**
     * 抽屉关闭 确认表单
     */
    handleClose(done) {
      if (this.loading) {
        return;
      }
      if (this.imgErr.length > 0) {
        return;
      }
      this.$confirm('确定要提交吗？', '确认信息', {
        showClose: false
      })
        .then((_) => {
          this.loading = true;
          this.submitForm('ruleForm');
        })
        .catch((_) => {});
    },

    /**
     * 提交表单
     */

    submitForm(n) {
      this.$refs[n].validate((valid) => {
        if (valid) {
          this.editBooks();
        } else {
          this.loading = false;
          console.log('error submit!!');
          return false;
        }
      });
    },

    /**
     * 编辑参考书
     */

    async editBooks() {
      this.err_bookname = ''; //清空自定义违规提示
      this.err_auth = ''; //清空自定义违规提示
      this.err_detail = ''; //清空自定义违规提示
      let s = this.bookId ? 2 : 1;
      let { result, status, message } = await api.editBooks(
        {
          uuid: this.bookId,
          author: this.ruleForm.author,
          book_name: this.ruleForm.name,
          cover_img: this.ruleForm.loadedImg[0].src,
          description: this.ruleForm.description,
          major_ids: this.ruleForm.major,
          school_ids: this.ruleForm.school
        },
        s
      );
      if (status == 200) {
        this.$message({
          type: 'success',
          message: '操作成功'
        });
        window.location.reload();
      } else {
        this.$message({
          type: 'warning',
          message: message
        });
      }
      if (status == 937) {
        //内容违规
        this.err_bookname =
          result.book_name && result.book_name.length ? '内容违规，违规词：' + result.book_name.join(',') : '';
        this.err_auth = result.author && result.author.length ? '内容违规，违规词：' + result.author.join(',') : '';
        this.err_detail =
          result.description && result.description.length ? '内容违规，违规词：' + result.description.join(',') : '';
      }
      this.loading = false;
    },

    majorChange(res) {
      this.ruleForm.major = res;
    },
    schoolChange(res) {
      this.ruleForm.school = res;
    },
    /**
     * 获取参考书详情
     */
    async getBookDetail() {
      let { status, result, message } = await api.getBookDetail({ book_uuid: this.bookId });
      if (status != 200) {
        this.$message({
          type: 'warning',
          message: message
        });
        return;
      }
      this.ruleForm.name = result.book_name;
      this.ruleForm.author = result.author;
      this.ruleForm.description = result.description;
      this.resTags = result.relation;
      this.ruleForm.loadedImg = [{ src: result.cover_img }];
      this.FileOptions.fileList = [{ src: result.cover_img }];
    },

    /**
     * 校验书名唯一
     */

    async bookNameUnique(val) {
      let { result } = await api.bookNameUnique({
        book_name: this.ruleForm.name,
        book_uuid: this.bookId
      });
      console.log(result.unqiue);
      return result.unqiue;
    },
    /**
     * 关闭抽屉
     */

    cancelForm() {
      this.loading = false;
      this.imgErr = '';
      this.$emit('dialog');
      clearTimeout(this.timer);
    },

    /**
     * 移除tag
     */

    async removeTag(item, index) {
      if (this.resTags.length < 2) {
        this.$message.warning('经营范围至少保留一个');
        return;
      }
      let { result } = await api.deleteBookRange('relation_id=' + item.id);

      this.resTags.splice(index, 1);
    },

    /**
     * 上传成功后的回调
     */

    uploadSuccess(res) {
      let { result, height, width, size } = res;
      let { domain, full_url } = result;
      // 存储图片地址数据
      let curl = 'https:' + `${domain}/${full_url}`,
        _this = this;
      //封面图表单赋值
      _this.ruleForm.loadedImg[0] = { src: curl, size, height, width };
      //触发封面图校验器
      _this.$refs['ruleForm'].validateField('loadedImg');

      //图片违规检测
      this.checkImage(curl).then(function (res) {
        _this.imgErr = ''; //清空封面图校验错误信息
        if (res.result.details && res.result.details.length) {
          _this.imgErr = '封面图违规：' + res.result.details[0].violate;
        } else {
          _this.$message({
            type: 'success',
            message: '图片上传成功！'
          });
        }
      });
    },
    //校验图片合规
    async checkImage(curl) {
      this.imgErr = '';
      let res = await api.checkImage({
        url: curl
      });
      return Promise.resolve(res);
    },

    /**
     * 上传失败后的回调
     */

    uploadFailed(err) {
      let { msg } = err;
      this.$message({
        type: 'error',
        message: msg
      });
      console.log('uploadFailed', err);
    },

    /**
     * 上传错误
     */

    uploadError(err) {
      let { msg, type } = err;
      let message = '';

      if (type == 'sizeValid') {
        message = '图片大小超过2MB，请重新上传!';
      } else if (type == 'typeValid') {
        message = '图片格式不是jpg或png，请检查后重新上传';
      } else {
        message = msg;
      }
      this.$message({
        type: 'error',
        message
      });
    },

    /**
     * 删除已上传
     */

    deleteUploadFile() {
      this.ruleForm.loadedImg = [];
      this.$refs['ruleForm'].validateField('loadedImg');
    }
  }
};
</script>
<style lang="scss" scpoed>
.el-drawer {
  overflow: scroll;
}
.form_label_w {
  font-weight: bold;
}
.switch_outer {
  margin-top: 20px;
  .el-switch__label {
    color: #999;
  }
  .el-switch__label.is-active {
    color: #15cfdc;
  }
}
.books_outer .oss-upload .image-con,
.books_outer .oss-upload .upload-launch-image {
  width: 70px;
  height: 93px;
  background: rgba(0, 0, 0, 0.02);
}
.books_outer .oss-upload .upload-launch-image i {
  width: 70px;
  line-height: 123px;
  font-style: normal;
  color: rgba(0, 0, 0, 0.2);
}
.books_outer .oss-upload .upload-launch-image i:before {
  left: 22px;
  top: 24px;
}
.books_outer .el-drawer__close-btn {
  outline: none;
}
.books_form .el-drawer__header > :first-child {
  color: rgba(0, 0, 0, 0.8);
  font-weight: bold;
}
</style>
