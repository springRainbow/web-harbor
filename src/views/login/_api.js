import api from '@/api'; // 引入公用api
const API_PREFIX = process.env.VUE_APP_API_PREFIX;
const _api = {
  getTalToken: `${API_PREFIX}/api-user/user/login/code` // 集团code换取token
};
export default { ...api, ..._api };
