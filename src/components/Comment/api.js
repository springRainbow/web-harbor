import http from '@/utils/http';
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const api = {
  getCommentList(params) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/comment/list`, params);
  },
  getReplayList(params) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/comment/reply`, params);
  },
  postReplay(params) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/news/comment/add`, params);
  },
  postdelete(params) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/news/comment/delete    `, params);
  }
};
export default api;
