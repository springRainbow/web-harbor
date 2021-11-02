/**
 * common.js
 **/

const state = {
  clientHeight: {}
};
const getters = {
  getClientHeight(state) {
    return state.clientHeight;
  }
};
const mutations = {
  updateClientHeight(state, clientHeight) {
    state.clientHeight = clientHeight;
  }
};
const actions = {
  updateClientHeight(context, item) {
    context.commit('updateClientHeight', item);
  }
};
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
};
