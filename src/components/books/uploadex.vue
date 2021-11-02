<template>
  <div>
    <!-- 批量上传 -->
    <el-dialog title="批量上传" class="upload_dialog" v-bind="$attrs" v-on="$listeners" width="30%">
      <img src="~@/assets/content/score_top.png" class="score_top" />
      <el-upload
        class="upload-demo"
        drag
        :limit="1"
        :action="uploadAddress"
        :multiple="false"
        :data="headers"
        accept=".xlsx"
        :on-progress="progress"
        :on-success="loadSuccess"
        style="margin: 15px 0; text-align: center"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
          <div class="el-upload__tip" slot="tip">Excel 格式文件，单个文件大小不超过 500M</div>
        </div>
      </el-upload>
      <div style="text-align: center; margin-bottom: 10px">
        <el-button
          :loading="isloading"
          style="margin: 0 auto"
          type="primary"
          @click="
            isloading = true;
            $emit('export-cli', year);
          "
          round
          >导出模板数据</el-button
        >
      </div>
      <p style="font-size: 12px; text-align: center; color: rgba(0, 0, 0, 0.4)">
        模版数据中包含所有未补充数据及模版格式。 <br />
        每次最多导出5000条数据，补充并上传完成后再导下一次哦，数据量太大会崩溃的...
      </p>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/views/content/_api.js';

export default {
  name: 'uploadex',
  props: ['year', 'loadtype'],
  data() {
    return {
      uploadAddress: process.env.VUE_APP_API_PREFIX + '/api-cpp/tenant/score/uploads',
      headers: { xky_year: this.year },
      isloading: false
    };
  },
  created() {
    if (this.loadtype == 2) {
      (this.uploadAddress = process.env.VUE_APP_API_PREFIX + '/api-cpp/enroll/uploads'),
        (this.headers = {
          enroll_year: this.year,
          tenant_uuid: window.localStorage.getItem('HARBOR_ID')
        });
    } else {
      this.uploadAddress = process.env.VUE_APP_API_PREFIX + '/api-cpp/tenant/score/uploads';
      this.headers = {
        ky_year: this.year,
        tenant_uuid: window.localStorage.getItem('HARBOR_ID')
      };
    }
  },
  computed: {},
  methods: {
    progress(m) {},
    loadSuccess(n) {
      this.$message({
        type: 'success',
        message: '上传成功'
      });
      window.location.reload();
    }
  }
};
</script>
<style lang="scss">
.score_top {
  width: 100%;
}
.upload_dialog {
  .el-dialog__body {
    max-height: 100%;
  }
  img {
    width: 100%;
  }
}
</style>
