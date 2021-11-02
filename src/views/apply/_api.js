import http from '@/utils/http';
import api from '@/api'; // 引入公用api
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const _api = {
  getTenantList() {
    return http.get(`${API_PREFIX}/api-harbor/tenant/search`);
  },
  // 申请轻舟号
  postCreateHarbor(params) {
    return http.post(`${API_PREFIX}/api-harbor/tenant/create`, params);
  }
};
export default { ...api, ..._api };
