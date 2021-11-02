<template>
  <el-drawer
    custom-class="component-content_comment"
    :visible.sync="showDrawer"
    :direction="'rtl'"
    :before-close="handleClose"
    destroy-on-close
    :show-close="false"
    size="988px"
    append-to-body
  >
    <div slot="title" class="title">
      <h3>评论列表</h3>
      <ul>
        <li :class="[{ active: activeName == '-1' }]" @click="activeName = '-1'">全部</li>
        <li :class="[{ active: activeName == '0' }]" @click="activeName = '0'">未回复</li>
        <li :class="[{ active: activeName == '1' }]" @click="activeName = '1'">已回复</li>
      </ul>
    </div>
    <div class="content">
      <template v-if="dataList.length">
        <template v-for="item in dataList">
          <com-card :key="item.comment_id" :dataInfo="item" :obj_id="obj_id" @refreshList="refreshList"> </com-card>
        </template>
        <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model="page"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="page_size"
        >
        </el-pagination>
      </template>
      <template v-else>
        <div style="height: 50px; line-height: 50px; text-align: center">暂无数据</div>
      </template>
    </div>
  </el-drawer>
</template>

<script>
import api from './api';
import ComCard from './card';

export default {
  name: 'comment',
  components: { ComCard },
  props: ['value', 'id'],
  watch: {
    value(v) {
      this.showDrawer = v;

      if (v) {
        if (this.id) {
          this.obj_id = this.id;
          this.getList();
        }
      }
    },
    showDrawer(v) {
      this.$emit('input', v);
    },
    activeName(v) {
      this.page = 1; //用于分页
      this.getList();
    }
  },
  data() {
    return {
      obj_id: '',
      showDrawer: false,
      activeName: '-1',
      dataList: [],
      total: 0,
      page: 1, //用于分页
      page_size: 5 //是否有更多
    };
  },
  created() {},
  methods: {
    refreshList() {
      this.getList();
    },
    getList() {
      let { page, page_size, obj_id } = this;
      api
        .getCommentList({
          obj_type: '101', // 评论
          obj_id,
          page_size,
          page,
          reply_status: this.activeName
        })
        .then(({ status, result }) => {
          if (status === 200) {
            this.dataList = result.data;
            this.total = result.total;
          }
        });
    },
    handleClose() {
      this.showDrawer = false;
    },
    handleSizeChange(v) {
      this.page_size = v;
      this.refreshList();
    },
    handleCurrentChange(v) {
      this.page = v;
      this.refreshList();
    }
  }
};
</script>

<style lang="scss">
.component-content_comment {
  .el-drawer__body {
    overflow: auto;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    h3 {
      color: #333;
      font-weight: bold;
      font-size: 18px;
    }
    ul {
      display: flex;
      flex-flow: row nowrap;
      li {
        cursor: pointer;
        color: #ccc;
        line-height: 14px;
      }
      li:not(:first-child) {
        @include common-space_line(12px);
      }
      li.active {
        color: #333;
      }
    }
  }
  .content {
    padding: 24px;
  }
}
</style>
