import api from '@/api';
import http from '@/utils/http'; // 引入公用api
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const _api = {
  // 员工列表 https://admin-api.kmf.com/#/group/79/api/detail_3934
  getStaffList(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/user/search`, params);
  },
  // 轻舟号新增员工 /api-harbor/tenant/user/create
  postCreateStaff(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/user/create`, params);
  },
  // 编辑员工 https://admin-api.kmf.com/#/group/79/api/detail_3940
  postEditStaff(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/user/update`, params);
  },
  // 删除员工 https://admin-api.kmf.com/#/group/79/api/detail_3942
  postDelStaff(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/user/delete`, params);
  },
  // 员工号详情 https://admin-api.kmf.com/#/group/79/api/detail_3947
  getDetailStaff(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/user/detail`, params);
  },
  // 角色列表 https://admin-api.kmf.com/#/group/79/api/detail_4066
  gerStaffRole() {
    return http.get(`${API_PREFIX}/api-harbor/tenant/role/search`);
  },
  // 创建角色 https://admin-api.kmf.com/#/group/79/api/detail_3923
  postCreateRole(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/role/create`, params);
  },
  // 编辑角色 https://admin-api.kmf.com/#/group/79/api/detail_3924
  postEditRole(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/role/update`, params);
  },
  // 删除角色 https://admin-api.kmf.com/#/group/79/api/detail_3925
  postDelRole(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/role/delete`, params);
  },
  // 角色详情 https://admin-api.kmf.com/#/group/79/api/detail_3926
  getDetailRole(params) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/role/detail`, params);
  },
  // 角色列表 https://admin-api.kmf.com/#/group/79/api/detail_4122
  getRoleList() {
    return http.get(`${API_PREFIX}/api-harbor/tenant/role/search`);
  }
};
export default { ...api, ..._api };
