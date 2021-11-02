<template>
  <div class="common-aside">
    <vue-scroll :style="{ height: `${clientHeight - 100}px` }">
      <el-menu
        background-color="#fff"
        active-text-color="#15CFDC"
        text-color="rgba(0,0,0,0.6)"
        :uniqueOpened="true"
        router
        :default-active="activePath"
      >
        <layout-menu :menus="menuList"></layout-menu>
      </el-menu>
    </vue-scroll>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import api from '@/api';
// import { routes } from '@/router';
import LayoutMenu from './menu';
export default {
  name: 'CommonAside',
  data() {
    return {
      menuList: [],
      authList: [],
      parentAuthList: [],
      activePath: '' // 当前路由
    };
  },
  components: { LayoutMenu },
  computed: {
    ...mapState({
      clientHeight: (state) => state.common.clientHeight
    })
  },
  watch: {
    $route(value) {
      console.log(value);
      this.activePath = value.path;
      // this.handleMenuData(this.menuList);
      // this.judgeAuth();
    }
  },
  created() {
    this.activePath = this.$route.path;
    this.getMenus();
  },
  methods: {
    // 为了处理在当前页刷新，重新请求菜单接口进行权限的判断
    async getMenus() {
      this.menuList = JSON.parse(sessionStorage.getItem('harbor_menu'));
      const res = await api.getSideMenu();
      if (res.status == 200) {
        this.menuList = res.result;
        if (!this.menuList.length) {
          this.$message.warning('您的账号未配置权限，请联系您的超管');
        }
        this.handleMenuData(this.menuList);
        this.judgeAuth();
      } else if (res.status == 902) {
        this.$message.error(res.message);
        localStorage.removeItem('HARBOR_ID');
        this.$router.push({
          name: 'apply'
        });
      } else {
        this.$message.error(res.message);
      }
    },
    handleMenuData(menu) {
      // this.authList = [];
      // this.parentAuthList = [];
      menu.forEach((el) => {
        if (el.children) {
          // this.parentAuthList.push(el.router);
          el.children.forEach((child) => {
            this.authList.push(child.router);
          });
          this.handleMenuData(el.children);
        }
      });
    },
    judgeAuth() {
      if (process.env.NODE_ENV == 'production' && this.authList.indexOf(this.$route.path) == -1) {
        // let _path;
        // if (this.parentAuthList.indexOf(this.$route.path) > -1) {
        //   _path = this.menuList[this.parentAuthList.indexOf(this.$route.path)].children[0].router;
        // } else {
        //   _path = this.menuList[0].children[0].router;
        // }
        this.$router.push({
          path: this.menuList[0].children[0].router,
          query: {
            u: this.$route.query.u
          }
        });
        // this.$message.error('无当前菜单的权限，已跳转至您有权限的菜单');
      }
    },
    sortArray(p1, p2) {
      return (a, b) => {
        return a[p1][p2] - b[p1][p2];
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.common-aside {
  width: 240px;
  background: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  // padding: 0 16px;
}
</style>
