import api from '@/api'; // 引入公用api
import http from '@/utils/http'; // 引入公用api
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const _api = {
  /* 数据概览 */
  // 获取昨日关键指标(顶部数据) https://admin-api.kmf.com/#/group/76/api/detail_4165
  getYesterdayOverview: (params) => http.get(`${API_PREFIX}/data/cpp/yesterday-key-indicators-overview`, params),
  // 获取关键指标数据趋势(线图) https://admin-api.kmf.com/#/group/76/api/detail_4166
  getOverviewIndicators: (params) => http.get(`${API_PREFIX}/data/cpp/key-indicators-overview`, params),
  // 获取线索咨询方式分布(饼图) https://admin-api.kmf.com/#/group/76/api/detail_4167
  getConsultingCluesWay: (params) => http.get(`${API_PREFIX}/data/cpp/consulting-clues-way`, params),
  // 获取数据明细(table) https://admin-api.kmf.com/#/group/76/api/detail_4168
  getOverviewDetail: (params) => http.get(`${API_PREFIX}/data/cpp/key-indicators-detail-overview`, params),
  // 下载数据明细 https://admin-api.kmf.com/#/group/76/api/detail_4169
  getDownloadOverview: (params) =>
    http.get(`${API_PREFIX}/data/cpp/key-indicators-detail-overview/download`, params, {
      responseType: 'blob'
    }),

  /* 内容分析列表 */
  // 获取二级专业数据 https://admin-api.kmf.com/#/group/76/api/detail_4181
  getNewsMajor: (params) => http.get(`${API_PREFIX}/data/cpp/news-major-params`, params),
  // 获取内容分析列表数据 https://admin-api.kmf.com/#/group/76/api/detail_4179
  getNewsList: (params) => http.get(`${API_PREFIX}/data/cpp/news-list`, params),
  // 下载内容分析列表 https://admin-api.kmf.com/#/group/76/api/detail_4180
  getDownloadNewsList: (params) =>
    http.get(`${API_PREFIX}/data/cpp/news-list/download`, params, {
      responseType: 'blob'
    }),

  /* 内容详情 */
  // 获取关键指标 https://admin-api.kmf.com/#/group/76/api/detail_4182
  getNewsOverview: (params) => http.get(`${API_PREFIX}/data/cpp/news-key-indicators-overview`, params),
  // 获取关键指标图表(线图) https://admin-api.kmf.com/#/group/76/api/detail_4183
  getNewsDetail: (params) => http.get(`${API_PREFIX}/data/cpp/news-key-indicators-overview-detail`, params),
  // 获取画像数据(饼图,柱状图) https://admin-api.kmf.com/#/group/76/api/detail_4185
  getUserPortrait: (params) => http.get(`${API_PREFIX}/data/cpp/news-index`, params),
  // 获取标题数据 https://admin-api.kmf.com/#/group/76/api/detail_4187
  getNewsTitle: (params) => http.get(`${API_PREFIX}/data/cpp/news`, params)
};
export default { ...api, ..._api };
