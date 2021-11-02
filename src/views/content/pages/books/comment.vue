<template>
  <div class="books_outer">
    <!-- <el-page-header @back="goBack" :title="detailRes.book_name" id="page_header"></el-page-header> -->
    <div style="overflow: hidden; margin-bottom: 5px">
      <img src="~@/assets/content/goback.png" @click="goBack" class="goback" />
      <p class="title_detail">{{ detailRes.book_name }}</p>
    </div>
    <div style="text-align: right">
      <el-button
        type="primary"
        round
        @click="
          vis = bookId;
          dialogSate = true;
        "
        >编辑参考书</el-button
      >
    </div>
    <!-- 内容区域 -->
    <div class="dec_outer">
      <div>
        <div class="cover_img_wrap">
          <!-- <el-image style="width: 100px; height: 132px" :src="detailRes.cover_img" fit="cover"></el-image> -->
          <oss-upload
            style="margin-top: -16px"
            :options="FileOptions"
            @uploadSuccess="uploadSuccess"
            @uploadFailed="uploadFailed"
            @uploadError="uploadError"
            ref="filesEle"
          ></oss-upload>
          <div class="change_cover">更换封面图</div>
          <p style="color: red; width: 100%; position: absolute; bottom: -23px; font-size: 12px">{{ imgErr }}</p>
        </div>
      </div>
      <div class="dec_rt">
        <div class="dec_item">
          <p class="lf_tag">简介：</p>
          <p class="rt_commit">{{ detailRes.description }}</p>
        </div>
        <div class="dec_item">
          <p class="lf_tag">作者：</p>
          <p class="rt_commit">{{ detailRes.author }}</p>
        </div>
        <div class="dec_item" style="margin-bottom: 0">
          <p class="lf_tag" style="width: 75px">适用范围：</p>
          <p class="rt_commit" style="margin-left: 75px">
            <span></span>
            <span v-for="(i, n) in detailRes.relation" :key="i.id">
              {{ i.school_name + '-' + i.major_name }}
              <i v-show="n + 1 != detailRes.relation.length">/</i>
            </span>
          </p>
        </div>
      </div>
    </div>
    <p v-if="isFineshedComment" class="comment_state">
      <i class="el-icon-check"></i>
      <span>已完成书评</span>
    </p>
    <div v-if="isFineshedComment == 0">
      <el-button type="primary" @click="addState = 1" round style="width: 80px">写书评</el-button>
      <!-- 写书评 -->
      <transition name="el-zoom-in-top">
        <addComment
          class="transition-box"
          v-show="addState == 1"
          v-model="addingComment"
          :recommentError="recommentError"
          v-on:edit-save="editSave(1)"
          v-on:edit-cancel="editCancel"
          :autosize="{ minRows: 4 }"
          resize="none"
          placeholder="请填写推荐评语，越干货越容易引人注意哦~"
        ></addComment>
      </transition>
    </div>
    <p class="lf_icon_title">机构书评</p>
    <!-- 书评列表 -->
    <ul class="comment_list" v-loading="loading" element-loading-spinner="el-icon-loading">
      <li v-for="item in commentsList" :key="item.id">
        <div style="overflow: hidden">
          <div class="fl">
            <el-image
              style="width: 36px; height: 36px; border-radius: 50%"
              :src="item.tenant_logo"
              fit="cover"
            ></el-image>
          </div>
          <p class="item_name">{{ item.tenant_name }}</p>
        </div>
        <div class="item_dec ft14">
          <template v-if="item.editState != 1">
            {{ item.recommend }}
            <el-link type="primary" v-if="uuid == item.tenant_uuid" @click="editComment(item)" style="margin-top: -3px"
              >编辑</el-link
            >
          </template>
          <!-- 编辑书当前书评 -->
          <addComment
            v-if="item.editState == 1"
            v-model="addingComment"
            v-on:edit-save="editSave(item)"
            v-on:edit-cancel="editCancel(item)"
            :recommentError="recommentError"
            :autosize="{ minRows: 4 }"
            resize="none"
            placeholder="请填写推荐评语，越干货越容易引人注意哦~"
          ></addComment>
        </div>
        <div v-show="item.editState != 1" class="item_bottom">
          <span>发布于{{ item.updated_at | dateYYYYMMDD }}</span>
          <span style="margin-left: 24px">共收获 {{ item.like_num }} 个赞</span>
        </div>
      </li>
    </ul>
    <!-- 分页 -->
    <div class="paination_wrap">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, pager, next,sizes,total"
        :page-sizes="[10, 20, 30]"
        :page-size="limit"
        :total="Total"
        hide-on-single-page
      ></el-pagination>
    </div>
    <!-- 编辑考书 -->
    <booksForm
      title="编辑参考书"
      :bookId="vis"
      :visible.sync="dialogSate"
      editType="2"
      :SchoolMajor="SchoolMajor"
      v-on:dialog="dialogSate = false"
      direction="rtl"
      size="50%"
    ></booksForm>
  </div>
</template>

<script>
import * as utils from '@/filters/index.js';
import api from '../../_api';
import addComment from '@/components/books/export.js';
import booksForm from '@/components/books/booksform.vue';

export default {
  name: 'comment',
  data() {
    return {
      addingComment: '', //当前编辑的书评内容
      isFineshedComment: 1, //是否完成过书评
      addState: 0, //新增书评 状态
      uuid: '', //当前机构uuid
      bookId: this.$route.query.id, //当前参考书id
      dialogSate: false, //编辑参考书抽屉打开状态
      detailRes: '',
      vis: '',
      SchoolMajor: {
        majors: [],
        schools: []
      }, //当前机构下经营范围的院校专业
      imgErr: '', //封面图违规
      commentsList: [], //评论列表
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
        maxSize: 2000000,
        multiple: true,
        maxLength: 1,
        overReplace: true,
        fileList: []
      },
      recommentError: '', //敏感词
      currentPage: 1,
      Total: 0, //评论总条数
      limit: 10,
      loading: false
    };
  },
  created() {
    this.uuid = window.localStorage.getItem('HARBOR_ID');
    this.getBookDetail();
    this.getBookRecommend();
    this.getSchoolMajor();
  },
  methods: {
    /**
     * 获取参考书详情
     */
    async getBookDetail() {
      let { result } = await api.getBookDetail({ book_uuid: this.bookId });
      this.detailRes = result;
      this.FileOptions.fileList = [{ src: result.cover_img }];
      this.isFineshedComment = result.is_recommend;
    },
    /**
     * 获取当前机构下院校专业
     */
    async getSchoolMajor() {
      let { result } = await api.getSchoolMajor({});
      this.SchoolMajor = result;
    },
    /**
     * 获取参考书评论
     */
    async getBookRecommend() {
      this.loading = true;
      let { result } = await api.getBookRecommend({
        book_uuid: this.bookId,
        limit: this.limit,
        page: this.currentPage
      });
      this.commentsList = result.items;
      this.Total = result.total;
      this.loading = false;
    },

    /**
     * 返回上一页
     */
    goBack() {
      this.$router.go(-1);
    },

    /**
     * 变更书评编辑状态
     */
    editComment(n) {
      this.$set(n, 'editState', 1);
      this.addingComment = n.recommend;
    },

    /**
     * 取消新增/取消编辑 书评
     */
    editCancel(n) {
      n ? this.$set(n, 'editState', 0) : (this.addState = 0);
    },
    /**
     *  保存  新增/编辑书评 n=1新增
     */
    async editSave(n) {
      let id = n == 1 ? '' : n.id; //n 1新增 否则编辑
      if (this.addingComment.trim().length < 1) {
        this.$message({
          type: 'warning',
          message: '书评内容不能为空'
        });
        return;
      }
      let { status, result, message } = await api.editBookRecommend({
        id: id,
        book_uuid: this.bookId,
        recommend: this.addingComment
      });
      if (status == 937) {
        this.recommentError = '内容存在敏感词：' + result.recommend.join(',');
        this.$message({
          type: 'warning',
          message: message
        });
        return;
      }
      this.$message({
        type: 'success',
        message: '操作成功'
      });
      this.addState = 0;
      this.isFineshedComment = 1;
      this.getBookRecommend();
    },

    /**
     * 上传成功后的回调
     */
    uploadSuccess(res) {
      console.log(res);
      let { result, height, width, size } = res;
      let { domain, full_url } = result;
      // 存储图片地址数据
      this.detailRes.cover_img = { src: `${domain}/${full_url}`, size, height, width };
      let s = `${domain}/${full_url}`,
        curl = 'https:' + s;

      let _this = this;
      this.checkImage(curl).then(function (res) {
        if (res.result.details && res.result.details.length) {
          _this.imgErr = '封面图无效：' + res.result.details[0].violate;
        } else {
          _this.editBooks({
            cover_img: curl,
            uuid: _this.bookId
          });
        }
      });
    },
    /**
     * 触发分页器
     */
    handleSizeChange(val) {
      this.limit = val;
      this.getBookRecommend();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBookRecommend();
    },
    //监测图片是否合规
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
    },

    /**
     * 上传错误
     */
    uploadError(err) {
      let { msg, type } = err;
      let message = '';

      if (type == 'sizeValid') {
        message = '图片大小超过5MB，请重新上传!';
      } else if (type == 'typeValid') {
        message = '图片格式不是jpeg或png，请检查后重新上传';
      } else {
        message = msg;
      }
      this.$message({
        type: 'error',
        message
      });
      console.log('uploadError: ', err);
    },

    /**
     * 编辑参考书
     */
    async editBooks(n) {
      let { result } = await api.editBooks(n);
      this.$message({
        type: 'success',
        message: '操作成功'
      });
    }
  },
  components: {
    addComment,
    booksForm
  }
};
</script>
<style lang="scss" scpoed>
.mt12 {
  margin-top: 12px;
}
.ft14 {
  font-size: 14px;
}
.ml14 {
  margin-left: 14px;
}
.books_outer {
  padding: 30px 30px 20px;
  box-sizing: border-box;
  background: white;
}
.dec_outer {
  margin-top: 12px;
  margin-bottom: 20px;
}
.dec_outer::after {
  clear: both;
  content: '';
  display: block;
  width: 0;
  height: 0;
}
.cover_img_wrap {
  width: 100px;
  position: relative;
  height: 132px;
  float: left;
  border-radius: 4px;
  overflow: hidden;
  .change_cover {
    position: absolute;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: white;
    width: 100%;
    padding: 6px 0;
    cursor: pointer;
  }
}
.lf_icon_title {
  font-size: 14px;
  color: #000;
  padding-left: 28px;
  margin: 24px 0 20px -30px;
  opacity: 0.8;
  margin-bottom: 0;
  position: relative;
  &::before {
    content: '';
    width: 4px;
    height: 100%;
    background: $mainColor;
    border-radius: 2px;
    position: absolute;
    left: 0;
  }
}
.dec_rt {
  margin-left: 120px;
}
.lf_tag {
  font-weight: bold;
  width: 45px;
  float: left;
  opacity: 0.8;
}
.rt_commit {
  margin-left: 45px;
  color: rgba(0, 0, 0, 0.6);
}
.dec_item {
  overflow: hidden;
  margin-bottom: 16px;
}
.textarea_bottom {
  text-align: right;
  overflow: hidden;
  margin-top: 10px;
  p {
    float: left;
    color: #000000;
    opacity: 0.2;
  }
}
.item_name {
  font-weight: bold;
  float: left;
  margin: 5px 0 0 10px;
}
.title_detail {
  color: rgba(0, 0, 0, 0.6);
  font-size: 20px;
  margin-left: 5px;
  margin-top: -2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keywords;
}
.goback {
  width: 24px;
  height: 24px;
  float: left;
  cursor: pointer;
}
.item_dec {
  line-height: 22px;
  margin: 6px 0 12px;
  color: rgba(0, 0, 0, 0.8);
}
.item_bottom {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.comment_list {
  li {
    padding: 16px 0;
    border-bottom: 1px solid #ebebeb;
  }
}
.comment_state {
  i {
    color: #15cfdc;
    font-weight: bold;
    margin-right: 2px;
  }
  span {
    font-size: 14px;
  }
}
.dec_outer .oss-upload .upload-launch-image {
  width: 100px;
  height: 132px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  opacity: 0;
}
.dec_outer .oss-upload .image-con img {
  height: 132px;
}
.paination_wrap {
  margin-top: 30px;
  text-align: center;
}
.paination_wrap .el-pager .number.active {
  background: white;
  color: #15cfdc;
}
.dec_outer .oss-upload {
  .image-con {
    width: 100%;
    height: 100%;
    .del-image {
      display: none;
    }
  }
}
#page_header {
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}
</style>
