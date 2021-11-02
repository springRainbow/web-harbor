<template>
  <el-drawer
    v-if="drawer"
    class="staff-drawer"
    :visible.sync="drawer"
    :with-header="false"
    size="60%"
    :wrapperClosable="false"
    destroy-on-close
  >
    <h3 class="tit">
      {{ curStaffId ? '编辑信息' : '添加员工' }}
      <span @click="drawer = false" class="fr el-icon-close staff-drawer_close"></span>
    </h3>
    <el-form ref="form" :model="form" label-width="170px" :rules="rules">
      <div class="staff-drawer_part">
        <h3 class="staff-drawer_part-tit">基本信息</h3>
        <el-form-item label="员工账号：" prop="phone">
          <el-input class="w200" placeholder="请输入员工轻舟手机号" v-model.trim="form.phone"></el-input>
          <span class="phone-tips">用户用此账号登录轻舟号平台</span>
        </el-form-item>
        <el-form-item label="员工姓名：" prop="real_name">
          <el-input class="w200" placeholder="员工真实姓名" v-model.trim="form.real_name"></el-input>
        </el-form-item>
      </div>
      <div class="staff-drawer_part">
        <h3 class="staff-drawer_part-tit">员工身份</h3>
        <el-form-item label="自定义：" prop="role_ids">
          <el-checkbox-group v-model="form.role_ids" @change="changeRoleIds" v-if="role.length">
            <el-checkbox v-for="(item, index) in role" :key="`add${index}`" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
          <el-button type="text" v-else @click="goConfigRole">暂无角色，去配置</el-button>
        </el-form-item>
      </div>
      <div class="staff-drawer_part" v-if="form.role_ids.length">
        <h3 class="staff-drawer_part-tit">
          账号权限<span v-if="checkedIds.length">显示该账号所具有的权限，权限仅供查看</span>
          <el-link class="ml12 mt-3" :underline="false" v-else type="danger" @click="goConfigRole"
            >当前角色未设置权限，点击去配置</el-link
          >
        </h3>
        <el-form-item label-width="100px">
          <el-tree
            class="role-tree"
            v-loading="treeLoading"
            ref="roleTree"
            :props="roleProps"
            :data="treeData"
            show-checkbox
            node-key="id"
            default-expand-all
            check-strictly
          >
          </el-tree>
        </el-form-item>
      </div>
      <el-form-item label-width="40px">
        <el-button plain @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="submitStaff" :loading="btnLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script>
import api from '../_api';
export default {
  name: 'StaffDrawer',
  props: {
    role: {
      type: Array
    }
  },
  data() {
    const checkMobile = async (rule, value, callback) => {
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (value == '') {
        return callback(new Error('请输入员工轻舟手机号'));
      } else if (!reg.test(value)) {
        return callback(new Error('手机号格式不正确'));
      } else {
        const res = await api.getValidPhone({ phone: value });
        if (res.result.exists) {
          callback();
        } else {
          return callback(new Error('该账号尚未注册，可下载考研帮进行注册。'));
        }
      }
    };
    const checkName = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      const eomjireg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
      if (value == '') {
        return callback(new Error('请输入员工真实姓名'));
      } else if (!reg.test(value) && !eomjireg.test(eomjireg)) {
        return callback(new Error('格式不正确，仅支持汉字、字母、数字'));
      } else {
        callback();
      }
    };
    return {
      drawer: false,
      rules: {
        phone: [{ validator: checkMobile, required: true, trigger: 'blur' }],
        real_name: [{ validator: checkName, required: true, trigger: 'blur' }],
        role_ids: [{ required: true, message: '请选择员工身份', trigger: 'blur' }]
      },
      form: {
        phone: '', // 员工账号
        real_name: '', // 真实姓名
        role_ids: [] // 角色
      },
      roleProps: {
        label: 'name',
        children: 'sons'
      },
      treeData: [],
      checkedIds: [],
      treeLoading: false,
      btnLoading: false,
      curStaffId: 0
    };
  },
  watch: {
    drawer(value) {
      if (!value) {
        this.form = {
          phone: '', // 员工账号
          real_name: '', // 真实姓名
          role_ids: [] // 角色
        };
      }
    }
  },
  methods: {
    goConfigRole() {
      this.$router.push({
        name: 'Role',
        query: {
          u: this.$route.query.u
        }
      });
    },
    showDrawer(data) {
      this.drawer = true;
      console.log(data);
      if (data) {
        // 编辑传入
        this.curStaffId = data.id;
        this.getUserPhone(data.id);
        const role_ids = [];
        data.roles.forEach((el) => {
          role_ids.push(el.id);
        });
        this.form = {
          id: data.id,
          phone: data.user.phone, // 员工账号
          real_name: data.real_name,
          role_ids: role_ids
        };
        this.changeRoleIds(role_ids);
      }
    },
    // 编辑前需要获取员工明文手机号
    async getUserPhone(id) {
      const res = await api.getUserPhone({ id });
      if (res.status == 200) {
        this.form.phone = res.result.phone;
      }
    },
    async changeRoleIds(value) {
      this.checkedIds = [];
      this.treeLoading = true;
      if (value.length) {
        const res = await api.getRoleMenu({
          role_ids: value
        });
        if (res.status == 200) {
          this.treeData = res.result.nodes;
          this.handleCheckNode(this.treeData);
          this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys(this.checkedIds);
          });
          setTimeout(() => {
            this.treeLoading = false;
          }, 300);
        }
      }
    },
    handleCheckNode(data) {
      data.forEach((el) => {
        if (el.checked && el.parent_id) {
          this.checkedIds.push(el.id);
        } else {
          el.disabled = true;
        }
        if (el.sons) {
          this.handleCheckNode(el.sons);
        }
      });
    },
    submitStaff() {
      this.btnLoading = true;
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let url;
          let params = JSON.parse(JSON.stringify(this.form));
          if (this.curStaffId == 0) {
            url = api.postCreateStaff(params);
          } else {
            params.id = this.curStaffId;
            url = api.postEditStaff(params);
          }
          const res = await url;
          if (res.status == 200) {
            this.$message.success('保存成功');
            this.$emit('success');
            this.drawer = false;
          } else {
            this.$message.error(res.message);
          }
        }
      });
      this.btnLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.staff-drawer {
  /deep/.el-form-item__label {
    font-size: 14px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.6);
  }
  &_close {
    font-size: 22px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.6);
    &:hover {
      color: $mainColor;
    }
  }
  .tit {
    padding: 24px 32px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
  }
  .phone-tips {
    margin-left: 8px;
    color: rgba(0, 0, 0, 0.2);
  }
  &_part {
    margin-bottom: 32px;
    &-tit {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      padding-left: 32px;
      box-sizing: border-box;
      border-left: 4px solid $mainColor;
      border-radius: 2px;
      margin-bottom: 16px;
      span {
        color: rgba(0, 0, 0, 0.2);
        font-size: 14px;
        margin-left: 12px;
      }
    }
  }
  .role-tree {
    /deep/label.el-checkbox {
      pointer-events: none;
    }
  }
}
</style>
