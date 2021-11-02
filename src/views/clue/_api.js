import api from '@/api'; // 引入公用api
import http from '@/utils/http';

const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const _api = {
  //获取线索统计列表  https://admin-api.kmf.com/#/group/80/api/detail_4148
  getStatList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/clue/stat/list`, data);
  },
  //获取线索卡片配置  https://admin-api.kmf.com/#/group/80/api/detail_4150
  getClueConfig(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/clue/card/config`, data);
  },
  //获取轻舟号用户线索列表 https://admin-api.kmf.com/#/group/80/api/detail_4149
  getUserListLogs(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/clue/tenant/user/list`, data);
  },
  //关注用户列表接口 https://admin-api.kmf.com/#/group/80/api/detail_4260
  getFocusList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/follow/list`, data);
  }
};
export default {
  ...api,
  ..._api
};
