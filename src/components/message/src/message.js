import Vue from 'vue'; // 引入 Vue 是因为要用到 Vue.extend() 这个方法
import message from './message.vue'; // 引入刚才的 toast 组件

let messageConstructor = Vue.extend(message); // 这个在前面的前置知识内容里面有讲到
let instance;

const Message = function (options = {}) {
  instance = new messageConstructor({
    data: options // 这里的 data 会传到 message.vue 组件中的 data 中，当然也可以写在 props 里
  }); // 渲染组件
  document.body.appendChild(instance.$mount().$el); // 挂载到 body 下
};
export default Message;
