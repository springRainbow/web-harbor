<template>
  <div>
    <section v-for="(item, index) in menus" :key="`menu${index}`">
      <el-menu-item
        v-if="!hasChild(item) && item.hidden !== 1"
        :data="item"
        :index="item.router"
        :route="{ path: item.router, query: $route.query }"
      >
        <i v-if="!item.children && item.meta.icon" :class="item.icon || 'el-icon-menu'"></i>
        <span class="pl9" slot="title">{{ item.name }}</span>
      </el-menu-item>
      <el-submenu v-else-if="item.children && item.hidden == 0" :data="item" :index="item.router">
        <template #title>
          <i :class="item.icon || 'el-icon-menu'"></i>
          <span>{{ item.name }}</span>
        </template>
        <LayoutMenu :menus="item.children"></LayoutMenu>
      </el-submenu>
    </section>
  </div>
</template>
<script>
export default {
  name: 'LayoutMenu',
  props: {
    menus: {
      type: Array
    }
  },
  methods: {
    hasChild(item) {
      return item.children && item.children.some((x) => x.hidden === 0);
    }
  }
};
</script>
<style lang="css">
.el-menu {
  border-right: 0;
}
.el-menu-item.is-active {
  background: rgba(21, 207, 220, 0.08) !important;
  font-size: 14px;
  font-weight: bold;
}
.el-menu-item:hover,
.el-submenu__title:hover {
  background: rgba(21, 207, 220, 0.08) !important;
}
</style>
