<template>
  <div class="role">
    <h3 class="tit">身份管理</h3>
    <div class="fl role-part role-name">
      <h3 class="role-part_tit">身份列表</h3>
      <div class="role-part_item role-part_default">
        <h3 class="role-part_item-tit">默认角色</h3>
        <ul>
          <li :class="{ active: currentRole == admin.id }" @click="showRoleMenus(admin)">{{ admin.name }}</li>
        </ul>
      </div>
      <div class="role-part_item role-part_custom">
        <h3 class="role-part_item-tit">
          自定义
      <el-button
        type="text"
        class="fr role-part_item-btn f14"
        size="mini"
        icon="el-icon-circle-plus-outline"
        @click="addRole"
        >添加</el-button
      >
        </h3>
        <ul>
          <li
            :class="{ active: currentRole == item.id }"
            v-for="(item, index) in roles"
            :key="`role${item.id}`"
            @click="showRoleMenus(item)"
          >
            <span class="role-text" :title="item.name">{{ item.name }}</span>
            <span class="fr role-part_btn">
              <i class="el-icon-edit" @click="editRoleName(item)"></i>
              <i class="el-icon-delete" @click="delRole(item.id)"></i>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="fl role-part role-menu">
      <h3 class="role-part_tit">
        <span>{{ currentRoleText }}</span>
        <span class="fr" v-if="currentAdmin == 0">
          <el-button class="p0" v-if="isMenuChange" type="text" @click="cancelMenu">取消</el-button>
          <el-button class="p0" :disabled="!isMenuChange" type="text" @click="updateRoleMenu" :loading="saveLoading"
            >保存</el-button
          >
        </span>
      </h3>
      <div>
        <el-tree
          ref="roleTree"
          :props="roleProps"
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          @check="handleCheck"
        >
        </el-tree>
      </div>
    </div>
    <el-dialog :title="isEdit ? '编辑角色' : '自定义角色'" :visible.sync="dialogVisible" width="360px" append-to-body>
      <div style="margin: -16px 0">
        <span>身份名称：</span
        ><el-input
          class="w240"
          placeholder="请输入身份名称"
          v-model.trim="roleName"
          maxlength="20"
          show-word-limit
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="postCreateRole" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../_api';
export default {
  name: 'Role',
  data() {
    return {
      currentRole: 0,
      currentRoleText: '超管',
      currentAdmin: 0, // 当前点击的角色是否为超管
      admin: {},
      roles: [],
      isEditRoleMenu: false,
      dialogVisible: false,
      roleProps: {
        label: 'name',
        children: 'sons'
      },
      treeData: [],
      roleName: '',
      roleNameArr: [],
      checkedIds: [],
      isMenuChange: false,
      saveLoading: false,
      isEdit: false // 编辑状态
    };
  },
  created() {
    this.getRoleList();
  },
  watch: {
    dialogVisible(value) {
      if (!value) {
        this.isEdit = false;
        this.roleName = '';
      }
    }
  },
  methods: {
    addRole() {
      if (this.roles.length >= 20) {
        this.$message.error('每个轻舟号最多创建20个角色');
      } else {
        this.dialogVisible = true;
      }
    },
    // 获取角色列表
    async getRoleList(data) {
      const res = await api.getRoleList();
      this.admin = res.result.admin;
      this.roles = res.result.roles.data;
      this.roleNameArr = [];
      this.roles.forEach((el) => {
        this.roleNameArr.push(el.name);
      });
      if (!data) {
        this.showRoleMenus(this.admin);
      } else {
        this.showRoleMenus(data);
      }
    },
    // 获取角色对应的菜单列表
    async showRoleMenus(role) {
      this.checkedIds = [];
      this.currentRole = role.id;
      this.currentRoleText = role.name;
      this.currentAdmin = role.is_admin;
      const res = await api.getRoleMenu({
        role_ids: [role.id]
      });
      if (res.status == 200) {
        this.treeData = res.result.nodes;
        this.handleCheckNode(this.treeData);
        this.$nextTick(() => {
          this.$refs.roleTree.setCheckedKeys(this.checkedIds);
        });
      } else {
        this.$message.error(res.message);
      }
    },
    // 创建轻舟号角色
    async postCreateRole() {
      if (this.roleNameArr.indexOf(this.roleName) > -1) {
        this.$message.error('当存在当前角色，请换一个名称吧');
        return;
      }
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      const eomjireg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
      if (!reg.test(this.roleName) && !eomjireg.test(this.roleName)) {
        this.$message.error('格式不正确，仅支持汉字、字母、数字');
        return;
      }
      const url = this.isEdit
        ? api.postEditRole({
            name: this.roleName,
            id: this.currentRole
          })
        : api.postCreateRole({
            name: this.roleName
          });
      const res = await url;
      if (res.status == 200) {
        this.$message.success(this.isEdit ? '修改成功' : '添加自定义角色成功');
        this.dialogVisible = false;
        this.isEdit = false;
        this.roleName = '';
        this.getRoleList(res.result.role);
      } else {
        this.$message.error(res.message);
      }
    },
    handleCheckNode(data) {
      data.forEach((el) => {
        if (this.currentAdmin == 1) {
          el.disabled = true;
        }
        if (el.checked && el.parent_id && el.sons.length == 0) {
          this.checkedIds.push(el.id);
        }
        if (el.sons) {
          this.handleCheckNode(el.sons);
        }
      });
    },
    // 更新当前角色菜单权限
    async updateRoleMenu() {
      this.saveLoading = true;
      const nodeids = this.$refs.roleTree.getCheckedKeys();
      const res = await api.updateRoleMenu({
        role_id: this.currentRole,
        node_ids: nodeids
      });
      if (res.status == 200) {
        this.$message.success('保存权限成功');
        this.showRoleMenus(res.result);
      } else {
        this.$message.error(res.message);
      }
      this.saveLoading = false;
      this.isMenuChange = false;
    },
    handleCheck(data) {
      this.isMenuChange = true;
    },
    cancelMenu() {
      this.isMenuChange = false;
      this.$refs.roleTree.setCheckedKeys(this.checkedIds);
    },
    editRoleName(data) {
      this.dialogVisible = true;
      this.roleName = data.name;
      this.isEdit = true;
    },
    delRole(id) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await api.postDelRole({
            id: id
          });
          if (res.status == 200) {
            this.$message.success('删除成功');
            this.getRoleList();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.role {
  padding: 24px 32px;
  .tit {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 24px;
  }
  .role-text {
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-part {
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    min-height: 660px;
    box-sizing: border-box;
    border-radius: 4px;
    &_tit {
      margin: 16px 24px;
      padding-bottom: 16px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.8);
      border-bottom: 1px solid #ebebeb;
    }
    &_item {
      margin-bottom: 24px;
      &-tit {
        padding-left: 24px;
        box-sizing: border-box;
        margin-bottom: 8px;
        color: rgba(0, 0, 0, 0.4);
        font-size: 14px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 100%;
          border-radius: 2px;
          left: 0;
          background: $mainColor;
        }
      }
      li {
        margin: 0 24px;
        color: rgba(0, 0, 0, 0.8);
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
        padding: 0 20px;
        cursor: pointer;
        &:hover,
        &.active {
          font-weight: bold;
          background: $mainColor;
          color: #fff;
        }
      }
      &-btn {
        margin-top: -4px;
        margin-right: 24px;
      }
    }
    &_btn {
      font-size: 16px;
      color: #fff;
      i {
        margin-left: 8px;
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
  &-name {
    width: 282px;
    margin-right: 20px;
  }
  &-menu {
    width: calc(100% - 320px);
  }
}
</style>
