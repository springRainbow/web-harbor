import http from '@/utils/http';
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const api = {
  // 获取菜单
  getSideMenu() {
    return http.get(`${API_PREFIX}/api-harbor/tenant/role/node/menu`);
  },
  // 公用的接口信息
  getUserInfo() {
    return http.get(`${API_PREFIX}/api-harbor/tenant/me?_t=${new Date().getTime()}`);
  },
  // 获取轻舟号类型列表
  getCompHarborType() {
    return http.get(`${API_PREFIX}/api-harbor/tenant/type/search`);
  },
  // 获取学校  https://admin-api.kmf.com/#/group/79/api/detail_4073
  getCompSchool(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/regions/schools`, params);
  },
  // 获取专业 https://admin-api.kmf.com/#/group/79/api/detail_4075
  getCompMajors(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/majors`, params);
  },
  // 获取轻舟号详情 https://admin-api.kmf.com/#/group/79/api/detail_3922
  getHarborDetail(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/detail`, params);
  },
  // 验证轻舟号用户名是否存在 https://admin-api.kmf.com/#/group/79/api/detail_4068
  getValidName(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/validate/tenant/name`, params);
  },
  // 获取轻舟号营业执照 https://admin-api.kmf.com/#/group/79/api/detail_4092
  getCompanyPicture(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/company/picture`, params, {
      responseType: 'blob'
    });
  },
  // 查询轻舟号角色权限节点（菜单）
  getRoleMenu(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/role/node/search`, params);
  },
  // 更新权限（菜单）
  updateRoleMenu(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/role/node/update`, params);
  },
  // 修改轻舟号 https://admin-api.kmf.com/#/group/79/api/detail_3917
  postUpdateHarbor(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/update`, params);
  },
  // 查看联系人手机号  https://admin-api.kmf.com/#/group/79/api/detail_3970
  getPhone(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/company/contact/phone`, params);
  },
  // 验证手机号是否注册轻舟号 https://admin-api.kmf.com/#/group/79/api/detail_4152
  getValidPhone(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/validate/tenant/phone`, params);
  },
  // 获取员工明文手机号 https://admin-api.kmf.com/#/group/79/api/detail_4154
  getUserPhone(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/user/phone`, params);
  }
};
export default api;
