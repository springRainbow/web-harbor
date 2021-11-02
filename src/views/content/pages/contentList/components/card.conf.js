/*
 * 卡片配置文件
 *
 */
export default {
  qq: {
    name: 'QQ',
    type: 'qq',
    tips: '* 为必填项，会话链接添加后，用户点击咨询卡片可直接发起临时对话窗口。',
    placeholder: '请输入引导语',
    formList: [
      {
        type: 'qr_code',
        label: '二维码',
        prop: 'qr_code',
        required: false
      },
      {
        type: 'text',
        label: 'QQ号',
        prop: 'qq_no',
        required: false,
        new_tip: '填写后用户可复制填写内容并跳转至QQ'
      },
      {
        type: 'text',
        label: '会话链接',
        prop: 'link',
        required: false
      }
    ],
    rules: {}
  },
  qqGroup: {
    name: 'QQ群',
    type: 'qqGroup',
    tips: '* 为必填项，进群链接添加后，用户点击咨询卡片可直接进群。',
    placeholder: '请输入引导语',
    formList: [
      {
        type: 'qr_code',
        label: '二维码',
        prop: 'qr_code',
        required: false
      },
      {
        type: 'text',
        label: 'QQ群号',
        prop: 'qq_no',
        required: false,
        new_tip: '填写后用户可复制填写内容并跳转至QQ'
      },
      {
        type: 'text',
        label: 'QQ群链接',
        prop: 'link',
        required: false
      }
    ],
    rules: {}
  },
  wechat: {
    name: '微信',
    type: 'wechat',
    tips: '* 为必填项',
    placeholder: '请输入引导语',
    formList: [
      {
        type: 'qr_code',
        label: '二维码',
        prop: 'qr_code',
        required: false
      },
      {
        type: 'text',
        label: '微信号',
        prop: 'wechat_no',
        required: false,
        new_tip: '填写后用户可复制填写内容并跳转至微信'
      }
    ],
    rules: {}
  },
  wechatGroup: {
    name: '微信群',
    type: 'wechatGroup',
    tips: '* 为必填项',
    placeholder: '请输入引导语',
    formList: [
      {
        type: 'qr_code',
        label: '二维码',
        prop: 'qr_code',
        required: true
      }
    ],
    rules: {
      qr_code: [{ required: true, message: '请选择二维码' }]
    }
  },
  public: {
    name: '公众号',
    type: 'public',
    tips: '* 为必填项',
    placeholder: '请输入引导语',
    formList: [
      {
        type: 'qr_code',
        label: '二维码',
        prop: 'qr_code',
        required: false
      },
      {
        type: 'text',
        label: '公众号名称',
        prop: 'wechat_no',
        required: false,
        new_tip: '填写后用户可复制填写内容并跳转至微信'
      }
    ],
    rules: {}
  },
  miniProgram: {
    name: '小程序',
    type: 'miniProgram',
    tips: '* 为必填项',
    placeholder: '请输入引导语',
    formList: [
      {
        type: 'select',
        label: 'crm分配规则标识',
        prop: 'allot_rule',
        required: true
      }
    ],
    rules: {}
  }
};
