/**
 * userInfo.js
 **/

const state = {
  userInfo: {}
};
const getters = {
  getUserInfo(state) {
    return state.userInfo;
  }
};
const mutations = {
  updateUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  }
};
const actions = {
  updateUserInfo(context, item) {
    context.commit('updateUserInfo', item);
  }
};
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
};
