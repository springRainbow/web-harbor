<template>
  <div class="common-header">
    <div class="common-header_layout">
      <img @click="goHome" class="common-header_logo" src="~@/assets/logo@2x.png" alt="logo" />
      <section class="common-header_user">
        <el-dropdown @command="handleCommand" size="medium">
          <span class="el-dropdown-link">
            <span v-if="userInfo.user">{{ userInfo.user.phone }}</span
            ><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="goList">轻舟号列表</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </section>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { isMobileDevice } from '@/utils/tool.js';
export default {
  name: 'CommonHeader',
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  created() {
    TAL_UC.rankConfig({
      'client-id': isMobileDevice() ? 391201 : 391101, // client-id由平台发放权限码，接入之前向平台申请
      env: process.env.NODE_ENV == 'production' ? 'production' : 'sandbox'
    });
  },
  methods: {
    goHome() {
      this.$router.push({
        name: 'apply'
      });
    },
    handleCommand(command) {
      if (command == 'goList') {
        this.goList();
      } else {
        this.logout();
      }
    },
    goList() {
      this.$router.push({ name: 'TenantList' });
    },
    // 退出登录
    logout() {
      let param = {
        data: {
          tal_token: this.$cookie.get('authkey')
        },
        success: (res) => {
          console.log(res);
          if (res.errcode == 0) {
            this.$cookie.delete('authkey', { domain: '.qz100.com' });
            this.$message.success('已退出登录');
            this.$router.push({
              name: 'login'
            });
          }
        },
        fail: (error) => {
          this.$message.error(error);
        }
      };
      TAL_UC.loginOut(param);
    }
  }
};
</script>
<style lang="scss" scoped>
.common-header {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
  position: fixed;
  z-index: 9;
  &_layout {
    width: 100%;
    height: 64px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 0 12px;
  }
  &_logo {
    width: 118px;
    height: 25px;
    cursor: pointer;
  }
  &_user {
    color: rgba(0, 0, 0, 0.6);
    &-out {
      position: relative;
      padding-left: 22px;
      margin-left: 20px;
      cursor: pointer;
      &::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        background: url('~@/assets/icon-logout.png') no-repeat;
        background-size: 18px;
        left: 0;
      }
      &:hover {
        color: $mainColor;
      }
    }
  }
}
</style>
<style>
@media screen and (min-width: 1440px) {
  .common-header_layout {
    width: 1440px !important;
  }
}
@media screen and (max-width: 1440px) and (min-width: 1180px) {
  .common-header_layout {
    width: 100% !important;
    min-width: 1180px !important;
  }
}
</style>
