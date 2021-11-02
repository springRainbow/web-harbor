<template>
  <div class="qzh-list" v-loading.fullscreen.lock="loadingPage" element-loading-spinner="qz-loading-gif">
    <h3 class="qzh-list_title">
      {{ list.length == 0 ? '创建轻舟号' : '选择轻舟号' }}
      <el-button
        v-if="list.length"
        class="qzh-list_apply fr"
        icon="el-icon-plus"
        type="primary"
        @click="showDialog"
        :loading="btnLoading"
        >创建轻舟号</el-button
      >
    </h3>
    <p v-if="typeList.length == 0 && list.length == 0">暂无轻舟号信息，请联系管理人员开放轻舟号</p>
    <vue-scroll :style="{ height: `${clientHeight - 160}px` }">
      <ul class="qzh-list_item" v-if="list.length">
        <li v-for="(item, index) in list" :key="index" class="g-clearfix" @click="goAdmin(item)">
          <span class="icon-type" :class="`type-${item.type_id}`"></span>
          <div class="list-logo fl">
            <img class="fl" v-lazy="item.logo_url" alt="logo" />
          </div>
          <div class="fl qzh-list_item-info">
            <h3>
              <em>{{ item.name }}</em> <span>/{{ item.is_founder == 1 ? '创建者' : '运营者' }}</span>
            </h3>
            <p>{{ item.company && item.company.company_name }}</p>
            <span class="status-tag" :class="statusText[item.audit_status].class">{{
              statusText[item.audit_status].text
            }}</span>
            <i v-if="item.audit_status == 2" class="nopass-edit" @click.stop="edit(item)">修改</i>
          </div>
        </li>
      </ul>
      <div v-else>
        <div class="apply-chose" v-loading="dialogLoading">
          <div
            v-for="(item, index) in typeList"
            :key="`${index}`"
            class="apply-chose_type"
            @click="createQz(item.id, index)"
          >
            <h3>{{ item.type_name }}</h3>
            <p v-html="item.description"></p>
          </div>
        </div>
      </div>
    </vue-scroll>

    <el-dialog v-if="list.length" :visible.sync="dialogVisible" width="1000px" :append-to-body="true">
      <p v-if="typeList.length == 0">暂无轻舟号信息，请联系管理人员开放轻舟号</p>
      <div class="apply-chose" v-loading="dialogLoading">
        <div
          v-for="(item, index) in typeList"
          :key="`${index}`"
          class="apply-chose_type"
          @click="createQz(item.id, index)"
        >
          <h3>{{ item.type_name }}</h3>
          <p v-html="item.description"></p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../_api';
import { mapState } from 'vuex';
export default {
  name: 'TenantList',
  data() {
    return {
      list: [], // 机构列表
      dialogVisible: false,
      dialogLoading: false,
      btnLoading: false,
      typeList: [],
      loadingPage: true,
      statusText: {
        1: {
          class: 'audit',
          text: '待审核'
        },
        2: {
          class: 'nopass',
          text: '未通过'
        },
        3: {
          class: 'normal',
          text: '正常'
        },
        4: {
          class: 'stop',
          text: '封号'
        }
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      clientHeight: (state) => state.common.clientHeight
    })
  },
  created() {
    sessionStorage.removeItem('clickAgree');
    this.getList();
  },
  methods: {
    // 获取列表
    async getList() {
      const res = await api.getTenantList();
      if (res.status == 200) {
        this.list = res.result.data;
        if (this.list.length == 0) {
          this.getHarborType();
        }
      }
      this.loadingPage = false;
    },
    async showDialog() {
      this.btnLoading = true;
      if (this.userInfo.owner_tenant >= 5) {
        this.$alert('您已经创建5个轻舟号，无法再次创建', '', {
          confirmButtonText: '我知道了',
          showClose: false,
          center: true
        });
        this.btnLoading = false;
      } else {
        this.getHarborType();
      }
    },
    async getHarborType() {
      this.dialogLoading = true;
      const res = await api.getCompHarborType();
      if (res.status == 200) {
        this.typeList = res.result;
        if (this.typeList.length) {
          sessionStorage.setItem(
            'agreement',
            JSON.stringify({
              privacy: res.result[0].privacy_agreement,
              service: res.result[0].service_agreement
            })
          );
        }
        // 如果类型只有一个，直接跳转到第一步
        if (this.typeList.length == 1 && this.list.length) {
          this.$router.push({
            name: 'applyProcess',
            params: {
              step: 1
            },
            query: {
              type: this.typeList[0].id
            }
          });
        } else {
          this.dialogVisible = true;
          this.btnLoading = false;
        }
      } else {
        this.btnLoading = false;
      }
      this.dialogLoading = false;
    },
    // 创建轻舟号
    createQz(type, index) {
      sessionStorage.setItem(
        'agreement',
        JSON.stringify({
          privacy: this.typeList[index].privacy_agreement,
          service: this.typeList[index].service_agreement
        })
      );
      this.$router.push({
        name: 'applyProcess',
        params: {
          step: 1
        },
        query: {
          type: type
        }
      });
    },
    // 为了配合进入不是空白页
    async goAdmin(data) {
      if (data.audit_status == 3) {
        this.loadingPage = true;
        localStorage.setItem('HARBOR_ID', data.uuid);
        const res = await api.getSideMenu();
        if (res.status == 200) {
          if (!res.result.length) {
            this.$message.warning('您的账号未配置权限，请联系您的超管');
          } else {
            sessionStorage.setItem('harbor_menu', JSON.stringify(res.result));
            this.$router.push({
              path: res.result[0].children[0].router,
              query: {
                u: data.uuid
              }
            });
          }
        } else if (res.status == 902) {
          this.$message.error(res.message);
          localStorage.removeItem('HARBOR_ID');
          this.$router.push({
            name: 'apply'
          });
        } else {
          this.$message.error(res.message);
        }
        // this.loadingPage = false;
      } else {
        this.$message.warning(
          data.audit_status == 4 ? '该轻舟号涉嫌违规，已被封号，如需解封请联系平台官方' : data.audit_status_text
        );
      }
    },
    edit(data) {
      // localStorage.setItem('HARBOR_ID', data.uuid);
      sessionStorage.setItem('clickAgree', true);
      this.$router.push({
        name: 'applyProcess',
        params: {
          step: 2
        },
        query: {
          u: data.uuid
        }
      });
    }
  },
  beforeDestroy() {
    this.loadingPage = false;
  }
};
</script>
<style lang="scss" scpoed>
.qzh-list {
  width: 1111px;
  min-height: 400px;
  margin: 0 auto;
  &_title {
    height: 36px;
    line-height: 36px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 20px;
  }
  &_apply {
    box-shadow: 0px 2px 8px 2px rgba(21, 207, 220, 0.08);
  }
  &_item {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 356px;
      height: 148px;
      background: rgba(255, 255, 255, 1) url('~@/assets/icon-list-bg.png') no-repeat right bottom;
      background-size: 89px;
      box-shadow: 0px 12px 20px 0px rgba(130, 148, 200, 0.04);
      border-radius: 8px;
      border: 1px solid rgba(232, 237, 245, 0.4);
      margin-right: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      padding: 24px;
      position: relative;
      cursor: pointer;
      transition: 0.3s all;
      i {
        font-style: normal;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      .icon-type {
        position: absolute;
        width: 54px;
        height: 20px;
        right: -1px;
        top: -1px;
        &.type-1 {
          background: url('~@/assets/icon-org.png') no-repeat;
          background-size: 54px 20px;
        }
        &.type-2 {
          background: url('~@/assets/icon-org.png') no-repeat;
          // background: url('~@/assets/icon-personal.png') no-repeat;
          background-size: 54px 20px;
        }
      }
      .list-logo {
        width: 99px;
        height: 99px;
        border-radius: 11px 11px 21px 11px;
        margin-right: 12px;
        overflow: hidden;
        background: #fff;
      }
      img {
        width: 100%;
        min-height: 99px;
        height: auto;
      }

      &:hover {
        box-shadow: 0px 20px 32px -12px rgba(39, 49, 76, 0.12);
        border: 1px solid rgba(232, 237, 245, 0.3);
        // .status-tag {
        //   color: #fff;
        //   background: rgba(255, 255, 255, 0.4);
        // }
        // .nopass-edit {
        //   color: #fff;
        // }
      }
    }
    &-info {
      h3 {
        font-size: 16px;
        font-weight: bold;
        line-height: 28px;
        span {
          font-size: 10px;
          color: rgba(0, 0, 0, 0.2);
        }
        em {
          display: inline-block;
          max-width: 144px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
      }
      p {
        height: 22px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
        margin-bottom: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 142px;
      }
      .status-tag {
        display: inline-block;
        width: 52px;
        height: 20px;
        background: rgba(246, 248, 251, 1);
        border-radius: 2px;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.2);
        &.nopass {
          background: rgba(255, 243, 241, 1);
          color: #f4664a;
        }
        &.stop {
          background: rgba(245, 245, 245, 1);
          color: rgba(0, 0, 0, 0.4);
        }
        &.normal {
          background: rgba(237, 252, 253, 1);
          color: #15cfdc;
        }
        &.audit {
          background: rgba(255, 249, 237, 1);
          color: #faad14;
        }
      }
      .nopass-edit {
        color: #45c8d2;
        font-size: 12px;
        margin-left: 8px;
        cursor: pointer;
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
}
.apply-chose {
  &_type {
    // width: 964px;
    min-height: 206px;
    // height: 206px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 40px 48px;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    &:nth-child(even) {
      background-image: url('~@/assets/type-bg-org.png');
      &:hover {
        background-image: url('~@/assets/type-bg-org-hover.png');
      }
      h3 {
        color: rgba(144, 111, 64, 1);
      }
      p {
        color: rgba(144, 111, 64, 0.6);
      }
    }
    &:nth-child(odd) {
      background-image: url('~@/assets/type-bg-pre.png');
      &:hover {
        background-image: url('~@/assets/type-bg-pre-hover.png');
      }
      h3 {
        color: rgba(93, 101, 119, 1);
      }
      p {
        color: rgba(93, 101, 119, 0.6);
      }
    }
    h3 {
      font-size: 32px;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    p {
      line-height: 26px;
      letter-spacing: 1px;
    }
  }
}
</style>
