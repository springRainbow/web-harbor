import api from '@/api'; // 引入公用api
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
import http from '@/utils/http';

const _api = {
  //获取上传视频的token https://admin-api.kmf.com/#/group/80/api/debug_4055
  getOssToken() {
    return http.get(`${API_PREFIX}/api-cpp/news/video/token`);
  },
  //获取中台点播系统上传阿里云oss所需要的值 https://wiki.zhiyinlou.com/pages/viewpage.action?pageId=101886501 点播系统文档
  getOssUploadInfo(data) {
    // return http.post('http://v.xueersi.com/api/vod/uploadTrans', data, headers);
    // return http.get('http://v.xueersi.com/api/vod/upload', data);
    return http.post(`${API_PREFIX}/api-cpp/tenant/video/upload`, data);
  },
  //提交到阿里云的视频
  submitUpload(url, data) {
    return http.post(url, data, {});
  },
  //获取视频和图片的列表 https://admin-api.kmf.com/#/group/80/api/list_502
  getMediaList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/material/list`, data);
  },
  //获取参考书列表  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4012
  getBooksList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/books`, data);
  },
  //获取参考书详情  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4013
  getBookDetail(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/book/detail`, data);
  },
  //获取参考书下评论列表  wiki:https://admin-api.kmf.com//#/group/80/api/detail_3988
  getBookRecommend(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/book/recommends`, data);
  },
  //新增/编辑书评  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4017
  editBookRecommend(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/book/recommend`, data);
  },
  //修改参考书  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4059
  editBooks(data, add) {
    return add == 1
      ? http.put(`${API_PREFIX}/api-cpp/tenant/book`, data)
      : http.post(`${API_PREFIX}/api-cpp/tenant/book`, data);
  },
  //素材库保存图片 https://admin-api.kmf.com/#/group/80/api/detail_4044
  saveImage(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/material/save/image`, data);
  },
  //素材库保存视频 https://admin-api.kmf.com/#/group/80/api/detail_4097
  saveVideo(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/material/save/video`, data);
  },
  // 删除指定素材 https://admin-api.kmf.com/#/group/80/api/detail_4043
  delMaterial(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/material/del`, data);
  },
  //内容生产 配置标签获取 地址：https://admin-api.kmf.com/#/group/80/api/detail_4103
  getTagConfig() {
    // return http.get(`${API_PREFIX}/api-cpp/news/tag/config`, data);
    return http.get(`${API_PREFIX}/api-cpp/tenant/tag/office`, {
      _t: new Date().getTime()
    });
  },
  //专业模糊搜索  wiki:https://admin-api.kmf.com//#/group/79/api/detail_4070
  getMajorsByDim(data) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/majors/search`, data);
  },
  //院校模糊搜索  wiki:https://admin-api.kmf.com//#/group/79/api/detail_4071
  getSchoolByDim(data) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/schools/search`, data);
  },
  //机构模糊搜索  wiki:https://admin-api.kmf.com/#/group/79/api/detail_4100
  getTenantByDim(data) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/select/tenant`, data);
  },
  //获取当前机构下院校专业  wiki:https://admin-api.kmf.com//#/group/80/api/detail_3984
  getSchoolMajor(data) {
    return http.get(`${API_PREFIX}/api-harbor/tenant/scopes`, data);
  },

  //删除参考书适用范围  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4058
  deleteBookRange(id) {
    return http._delete(`${API_PREFIX}/api-cpp/tenant/book/relation?${id}`);
  },
  //校验参考书名称唯一  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4015
  bookNameUnique(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/book/unique`, data);
  },
  //获取分数线列表  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4018
  getScoreList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/score/stat_list`, data);
  },
  //获取把录比列表  wiki:https://admin-api.kmf.com//#/group/80/api/detail_3987
  getStatList(id) {
    return http.get(`${API_PREFIX}/api-cpp/enroll/stat/list`);
  },
  //获取指定年份分数线详情 wiki：https://admin-api.kmf.com//#/group/80/api/detail_4022
  getScoreYearList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/score/year_list`, data);
  },
  //获取指定年份分数线详情 wiki：https://admin-api.kmf.com//#/group/80/api/detail_3989
  getStatYearList(data) {
    return http.get(`${API_PREFIX}/api-cpp/enroll/list/info`, data);
  },
  //提交分数线  wiki:https://admin-api.kmf.com//#/group/80/api/detail_4025
  saveScore(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/score`, data);
  },
  //提交报录比  wiki:https://admin-api.kmf.com//#/group/80/api/detail_3991
  saveStat(data) {
    return http.put(`${API_PREFIX}/api-cpp/enroll/save`, data);
  },
  // 轻舟号近期自定义标签获取 https://admin-api.kmf.com/#/group/80/api/detail_4155
  getTagsList(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/custom/tag`, data);
  },
  //自定义标签创建获取 https://admin-api.kmf.com/#/group/80/api/detail_4119
  saveCustomTag(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/tag/custom`, data);
  },
  //内容创建、草稿保存、内容发布功能 https://admin-api.kmf.com/#/group/80/api/detail_4144
  submitContent(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/news/drafts`, data);
  },
  //草稿内容获取 https://admin-api.kmf.com/#/group/80/api/detail_4160
  getDraftsInfo(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/drafts`, data);
  },
  //轻舟号内容列表 https://admin-api.kmf.com/#/group/80/api/detail_4171
  getNewsList(data) {
    let url = data.audit_flag < 0 ? 'drafts-list' : 'list';
    if (data.audit_flag < 0) {
      delete data.audit_flag;
    }
    data._t = new Date().getTime();
    return http.get(`${API_PREFIX}/api-cpp/tenant/news/${url}`, data);
  },
  //导出报录比模板
  getExport(data) {
    return http.get(`${API_PREFIX}/api-cpp/enroll/export`, data, {
      responseType: 'blob'
    });
  },
  //监测图片是否违规 https://admin-api.kmf.com/#/group/80/api/detail_4197
  checkImage(data) {
    return http.post(`${API_PREFIX}/api-cpp/admin/examine/openai/image`, data);
  },
  //导出分数线模板
  getScoreExport(data) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/score/export`, data, {
      responseType: 'blob'
    });
  },
  //内容下线  https://admin-api.kmf.com//#/group/80/api/detail_4145
  doOffline(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/news/offline`, data);
  },
  //内容删除  https://admin-api.kmf.com//#/group/80/api/detail_4146
  doDelete(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/news/del`, data);
  },
  //内容操作日志获取  https://admin-api.kmf.com/#/group/80/api/detail_4191
  getNewsLog(drafts_uuid) {
    return http.get(`${API_PREFIX}/api-cpp/tenant/news-oplog`, {
      drafts_uuid
    });
  },
  //编辑机构后台内容的发布时间 https://admin-api.kmf.com/#/group/80/api/detail_4201
  changePublishTime(data) {
    return http.post(`${API_PREFIX}/api-cpp/tenant/news/schedule`, data);
  },
  // 视频播放地址获取 https://project.zhiyinlou.com/project/6035bbd75c206e0024656d98/tasks/view/606c2597f5a7a80024f0aca7
  getVideoRealPath(filepath) {
    return http.get(`${API_PREFIX}/api-cpp/user/video/play`, {
      filepath
    });
  },
  // 分配规则搜索 https://admin-api.kmf.com/#/group/54/api/detail_4338
  getAllocateRule(like_alias) {
    return http.get(`${API_PREFIX}/api-crm/component/allocate/rule/search`, {
      like_alias
    });
  }
};
export default {
  ...api,
  ..._api
};
