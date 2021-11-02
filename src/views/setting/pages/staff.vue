<template>
  <div class="staff">
    <h3 class="tit">
      员工管理
      <el-button class="staff-btn fr" type="primary" icon="el-icon-plus" @click="showStaffDrawer">添加员工</el-button>
    </h3>
    <el-form ref="filterForm" :model="filterForm" inline>
      <el-form-item class="f14" label="姓名：" prop="name">
        <el-input placeholder="输入员工名称搜索" v-model="filterForm.name"></el-input>
      </el-form-item>
      <el-form-item class="f14" label="身份：" prop="role_id">
        <el-select v-model="filterForm.role_id" placeholder="全部">
          <el-option label="全部" :value="0"></el-option>
          <el-option
            v-for="(item, index) in role"
            :key="`role${index}`"
            :label="item.role_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini">查询</el-button>
        <el-button plain @click="reset" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="tableLoading" size="medium">
      <el-table-column label="姓名" prop="real_name">
        <template slot-scope="scope">
          {{ scope.row.is_founder ? '超管' : scope.row.real_name || scope.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column label="身份" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.roles" :key="`role${index}`">
            <em v-if="index != 0" style="margin: 0 4px; color: #aaa">|</em>
            {{ item.role_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          <div>
            {{ scope.row.user ? scope.row.user.phone : '用户已注销' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="添加日期" prop="created_at"></el-table-column>
      <el-table-column label="操作" prop="created_at" width="120px" align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.is_founder">
            <el-link class="mr12" :underline="false" type="primary" @click="edit(scope.row)" v-if="scope.row.user"
              >编辑</el-link
            >
            <el-link
              class="mr12"
              style="visibility: hidden"
              :underline="false"
              type="primary"
              @click="edit(scope.row)"
              v-if="!scope.row.user"
              >占位</el-link
            >
            <el-link :underline="false" type="danger" @click="delStaff(scope.row.id)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      class="mt12"
      @current-change="handleCurrentChange"
      :current-page="filterForm.page"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="pageTotal"
      hide-on-single-page
    >
    </el-pagination>
    <staff-drawer ref="staffDrawer" :role="role" @success="submitSuccess"></staff-drawer>
  </div>
</template>
<script>
import api from '../_api';
const StaffDrawer = () => import(/* webpackChunkName:'staff' */ './staffDrawer');
export default {
  name: 'Staff',
  data() {
    return {
      list: [],
      role: [],
      tableLoading: false,
      pageTotal: 0,
      filterForm: {
        name: '',
        role_id: 0,
        page: 1
      }
    };
  },
  components: {
    StaffDrawer
  },
  created() {
    this.getStaffList();
    this.gerStaffRole();
  },
  methods: {
    handleCurrentChange(page) {
      this.filterForm.page = page;
      this.getStaffList();
    },
    async getStaffList() {
      this.tableLoading = true;
      const res = await api.getStaffList(this.filterForm);
      if (res.status == 200) {
        this.list = res.result.data;
        this.pageTotal = res.result.total;
      }
      this.tableLoading = false;
    },
    async gerStaffRole() {
      const res = await api.gerStaffRole();
      this.role = res.result.roles.data;
    },
    showStaffDrawer() {
      this.$refs.staffDrawer.showDrawer();
    },
    submitSuccess() {
      this.getStaffList();
    },
    search() {
      this.filterForm.page = 1;
      this.getStaffList();
    },
    edit(data) {
      this.$refs.staffDrawer.showDrawer(data);
    },
    delStaff(id) {
      this.$confirm('确认删除？删除后，该账号将无法登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await api.postDelStaff({ id: id });
        if (res.status == 200) {
          this.$message.success('删除成功');
          this.getStaffList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    reset() {
      this.$refs.filterForm.resetFields();
      this.filterForm.page = 1;
      this.getStaffList();
    }
  }
};
</script>
<style lang="scss" scoped>
.staff {
  padding: 32px;
  .tit {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 24px;
  }
  &-btn {
    margin-top: -2px;
  }
}
</style>
