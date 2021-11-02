<template>
  <div>
    <div class="editor-main">
      <!-- 工具栏 -->
      <div id="toolbar-container" class="toolbar" :style="fixedClass"></div>
      <!-- 建联卡片区域 start -->
      <div class="consult-card-list" v-if="!info_type">
        <span class="card-text">插入建联卡片</span>
        <div class="consult-card-list-container" @click="setCard($event)">
          <div class="consult-card-list-container-button" data-label="public">公众号</div>
          <div class="consult-card-list-container-button" data-label="wechat">微信</div>
          <div class="consult-card-list-container-button" data-label="qq">QQ</div>
          <div class="consult-card-list-container-button" data-label="wechatGroup">微信群</div>
          <div class="consult-card-list-container-button" data-label="qqGroup">QQ群</div>
          <div class="consult-card-list-container-button" data-label="miniProgram" v-if="is_official">小程序</div>
        </div>
      </div>
      <!-- 建联卡片区域 end -->

      <el-input
        v-model="content.title"
        placeholder="请输入标题（不超过30字）"
        maxlength="30"
        show-word-limit
        class="editor-title-input"
      ></el-input>
      <el-input
        v-model="content.author_name"
        placeholder="请写入作者（不超过16个字）"
        maxlength="16"
        show-word-limit
        class="editor-author-input"
      ></el-input>
      <!-- 视频中的内容简介 -->
      <el-input
        class="abstract111"
        v-if="info_type"
        type="textarea"
        v-model="abstract"
        placeholder="请输入内容简介……（限100字，可不填。）"
        maxlength="100"
        show-word-limit
        :rows="5"
      ></el-input>
      <!-- 编辑器区域 -->
      <div id="text-container" v-if="!info_type" :style="h60()"></div>
    </div>
    <p style="font-size: 14px; color: rgba(0, 0, 0, 0.2); line-height: 26px" v-if="info_type">
      最多可输入 100 字，可不填
    </p>
    <!-- 建联卡片组件 -->
    <consult-card :contact_card="contact_card" @insertCard="insertCard" @cancal="cancal"></consult-card>
    <MaterialImage ref="materialImgDialog" @submitSucceed="submitSucceed"></MaterialImage>
    <MaterialVideo ref="materialVideoDialog" @submitSucceed="submitSucceed"></MaterialVideo>
    <input
      type="file"
      name="file"
      style="display: none"
      class="file-input"
      multiple
      ref="fileEle1"
      @change="handleFileChange"
    />
    <oss-upload
      :options="fileOptions"
      @uploadSuccess="uploadSuccess"
      @uploadFailed="uploadFailed"
      @uploadError="uploadError"
      ref="filesEle"
      v-show="false"
    >
    </oss-upload>
  </div>
</template>
<script>
// 引入 wangEditor
import wangEditor from 'wangeditor';
import ConsultCard from './ConsultCard.vue';
import MaterialImage from './MaterialImage.vue';
import MaterialVideo from './MaterialVideo.vue';
import { json2html, html2json } from 'html2json';
import md5 from 'js-md5';
import api from '../../../_api';
import cardConf from './card.conf';

export default {
  components: {
    ConsultCard,
    MaterialImage,
    MaterialVideo
  },
  props: {
    info_type: Number,
    is_official: Boolean, //自营标志
    scrollTop: Number
  },
  data() {
    return {
      editor: null,
      editorData: '', //编辑器中的内容
      contact_card: {
        type: ''
      }, //联系卡片信息，数组内对象字段前端自定义
      currentCardType: '',
      cardData: {},
      content: {
        title: '',
        author_name: ''
      },
      abstract: '',
      material: [], //涉及到的图片视频信息  id素材库ID type(video 、picture) key_word前端自定义关键字 sequence资源在内容中的序号 file_name
      deleteImgIcon: require('@/assets/tag_delete.png'),
      fixedClass: {},
      fileOptions: {
        parameters: {
          authkey: '',
          product_line: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp',
          space: 'kmf-image',
          subject: process.env.NODE_ENV == 'production' ? 'api-cpp' : 'test-api-cpp'
        },
        multiple: false,
        maxLength: 1,
        overReplace: true,
        fileList: []
      }
    };
  },
  mounted() {
    let v_this = this;
    //图文中插入编辑器
    if (this.$route.query.info_type != 1) {
      const editor = new wangEditor('#toolbar-container', '#text-container');
      editor.config.placeholder = '请写入正文…';
      editor.config.zIndex = 500;
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml;
      };
      const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = wangEditor;

      // 注册图片插入菜单
      // class ImgUploadMenu extends BtnMenu {
      //   constructor(editor) {
      //     // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
      //     const $elem = $(`<div class="w-e-menu" data-title="图片"><i class="w-e-icon-image"></i></div>`);
      //     super($elem, editor);
      //     // 绑定事件
      //     bindTooltipEvent(editor);
      //   }
      //   // 菜单点击事件
      //   clickHandler() {
      //     //展示图片素材库
      //     window.showMaterialDialog(0);
      //   }
      //   tryChangeActive() {
      //     // this.active()
      //   }
      // }
      class ImgUploadMenu extends DropListMenu {
        constructor(editor) {
          const $elem = $(`<div class="w-e-menu" data-title="图片"><i class="w-e-icon-image"></i></div>`);
          // droplist 配置
          const dropListConf = {
            width: 100,
            title: '',
            type: 'list',
            list: [
              { $elem: $('<li class="w-e-item">本地图片</li>'), value: 'local' },
              { $elem: $('<li class="w-e-item">素材库图片</li>'), value: 'material' }
            ],
            // droplist 每个 item 的点击事件
            clickHandler: (value) => {
              // value 参数即 dropListConf.list 中配置的 value
              this.command(value);
            }
          };

          super($elem, editor, dropListConf);
        }

        command(value) {
          if (value === 'material') {
            window.showMaterialDialog(0);
          } else {
            v_this.triggerFileInput();
          }
        }

        // 菜单是否需要激活
        tryChangeActive() {
          const reg = /^h/i;
          const cmdValue = this.editor.cmd.queryCommandValue('formatBlock');
          if (reg.test(cmdValue)) {
            // 选区处于标题内，激活菜单
            this.active();
          } else {
            // 否则，取消激活
            this.unActive();
          }
        }
      }
      //注册视频插入菜单
      class VideoUploadMenu extends BtnMenu {
        constructor(editor) {
          // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
          const $elem = $(`<div class="w-e-menu" data-title="视频"><i class="w-e-icon-play"></i></div>`);
          super($elem, editor);
        }
        // 菜单点击事件
        clickHandler() {
          window.showMaterialDialog(1);
        }
        tryChangeActive() {
          // this.active()
        }
      }

      // 菜单 key ，各个菜单不能重复
      const menuKey = 'imgUploadMenuKey';
      // 注册菜单
      wangEditor.registerMenu(menuKey, ImgUploadMenu);
      // 菜单 key ，各个菜单不能重复
      const videoMenuKey = 'videoUploadMenuKey';
      // 注册菜单
      wangEditor.registerMenu(videoMenuKey, VideoUploadMenu);
      //自定义操作区域
      editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'list',
        'todo',
        'justify',
        'quote',
        'table',
        'splitLine',
        'undo',
        'redo'
      ];
      //忽略粘贴的图片
      editor.config.pasteIgnoreImg = true;
      // 配置粘贴文本的内容处理
      editor.config.pasteTextHandle = function (pasteStr) {
        // 对粘贴的文本进行处理，然后返回处理后的结果
        return pasteStr.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');
      };
      // 创建编辑器
      editor.create();
      this.editor = editor;
      //编辑信息挂在到全局
      window.editInfo = this.editInfo;
      //调用展示素材库的方法绑定到全局
      window.showMaterialDialog = this.showMaterialDialog;
      try {
        //web components 展示图片或者视频
        class QzEditorMedia extends HTMLElement {
          constructor() {
            // 必须首先调用 super方法
            super();
            let _this = this;
            // 创建一个 shadow root
            var shadow = this.attachShadow({ mode: 'open' });
            let isVideo = this.getAttribute('type') == 'video' ? true : false;
            // 创建一个
            let wrapper = '',
              src = '';
            if (isVideo) {
              wrapper = document.createElement('video');
              wrapper.setAttribute('poster', this.getAttribute('poster'));
              src = this.getAttribute('src');
            } else {
              wrapper = document.createElement('img');
              wrapper.setAttribute('style', 'max-width:500px;width:100%');
              src = `//image.kmf.com/` + this.getAttribute('src').replace('//image.kmf.com/', ''); //替换掉content中的域名，防止域名改变，在这里统一管理
            }
            wrapper.setAttribute('src', src);
            var style = document.createElement('style');

            style.textContent = `
                        .delete-image{
                             position: absolute;
                            top: -10px;
                            right: -10px;
                            cursor: pointer;
                            width: 20px;
                        }
                        .span_box{
                          position: relative;
                          display:inline-block;
                        }
                        `;

            shadow.appendChild(style);
            let deleteImg = document.createElement('img');
            deleteImg.setAttribute('src', v_this.deleteImgIcon);
            deleteImg.setAttribute('class', 'delete-image');
            deleteImg.onclick = function () {
              _this.remove();
            };
            var span_box = document.createElement('span');
            span_box.setAttribute('class', 'span_box');
            span_box.appendChild(deleteImg);

            span_box.appendChild(wrapper);
            shadow.appendChild(span_box);
          }
        }
        customElements.define('qz-editor-media', QzEditorMedia);

        //web components 展示建联卡片
        class ConsultCard extends HTMLElement {
          constructor() {
            // 必须首先调用 super方法
            super();
            // 创建一个 shadow root
            let _this = this;
            var shadow = this.attachShadow({ mode: 'open' });

            // 卡片类型
            let card_type = this.getAttribute('card-type');

            // 创建一个 spans
            var wrapper = document.createElement('div');
            wrapper.setAttribute('class', 'card-show');
            wrapper.onclick = function () {
              editInfo(_this.getAttribute('data-id'));
            };

            let deleteImg = document.createElement('img');
            deleteImg.setAttribute('src', v_this.deleteImgIcon);
            deleteImg.setAttribute('class', 'delete-image');
            deleteImg.onclick = function () {
              v_this
                .$confirm(`确认删除${card_type == '2' ? '图片' : '文字'}卡片么?`, '确认信息', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '确认',
                  cancelButtonText: '取消'
                })
                .then(() => _this.remove())
                .catch((err) => console.log(err));
            };
            if (card_type !== '2') {
              var content = document.createElement('div');
              content.setAttribute('class', 'card-show-content');
              var text = this.getAttribute('card-show-content').split('/#id#/')[0];
              content.textContent = text;

              var btnArea = document.createElement('div');
              btnArea.setAttribute('class', 'card-show-right');
              var btn = document.createElement('div');
              btn.setAttribute('class', 'card-show-right-btn');
              btn.textContent = '查看详情';
              btnArea.appendChild(btn);

              var style = document.createElement('style');

              style.textContent = `
                    .card-show {
                      cursor: pointer;
                      width: 350px;
                      background: rgba(248, 248, 248, 1);
                      border-radius: 8px;
                      display: flex;
                      padding: 12px;

                    }
                    .card-show-content {
                        flex: 1;
                        margin-left: 12px;
                        line-height: 28px;
                      }
                      .card-show-right {

                      }
                      .card-show-right-btn {
                          background: #15cfdc;
                          border-radius: 14px;
                          font-size: 12px;
                          font-weight: 500;
                          color: rgba(255, 255, 255, 1);
                          line-height: 12px;
                          padding: 8px 10px;
                          margin-right: 12px;
                        }
                        .delete-image{
                          position: absolute;
                          top: 0;
                          left: 360px;
                          cursor: pointer;
                          z-index:100;
                          width: 20px;
                        }
                        `;

              shadow.appendChild(style);
              shadow.appendChild(deleteImg);
              shadow.appendChild(wrapper);
              wrapper.appendChild(content);
              wrapper.appendChild(btnArea);
            } else {
              wrapper.setAttribute(
                'style',
                `
                max-width: 350px;
                position: relative;
                cursor: pointer
              `
              );
              deleteImg.setAttribute(
                'style',
                `
                position: absolute;
                top: -10px;
                right: -10px;
                cursor: pointer;
                z-index:100;
                width: 20px;
              `
              );
              let url = _this.getAttribute('card-logo').replace('//kmf-image.oss-cn-beijing.aliyuncs.com/', '');
              url = `//image.kmf.com/` + url.replace('//image.kmf.com/', '');
              const img = document.createElement('img');
              img.setAttribute('src', url);
              img.setAttribute(
                'style',
                `
                width: 100%;border-radius: 8px;
              `
              );
              img.onload = () => {
                wrapper.appendChild(img);
                shadow.appendChild(wrapper);
                wrapper.appendChild(deleteImg);
              };
            }
            let p_box = document.createElement('p');
            shadow.appendChild(p_box);
          }
        }
        customElements.define('consult-card', ConsultCard);
      } catch (e) {
        console.log(e);
      }
    }
  },
  created() {},
  methods: {
    // 插入建联卡片
    insertCard(config) {
      let data = JSON.parse(JSON.stringify(config));
      if (!data.id) {
        data.id = md5(`${new Date().getTime()}''`); //增加组件id
        this.editor.cmd.do(
          'insertHTML',
          `
              <consult-card data-id="${data.id}" title="点击编辑" card-show-content="${data.guidance_document}/#id#/${data.id}" style="position: relative;" card-type="${data.card_type}" card-logo="${data.card_logo}">
              </consult-card>
          `
        );
        this.editor.cmd.do('insertHTML', '<p><br/></p>');
        this.currentCardType = '';
      } else {
        let text = new RegExp(`card-show-content=\"${config.old_guidance_document}\/#id#\/${data.id}\"`);
        let html = this.editorData.replace(text, `card-show-content="${data.guidance_document}/#id#/${data.id}"`);
        const hasOldGuide = text.test(text);
        this.editor.txt.html(html);
        // 新编辑逻辑
        let json = html2json(html);
        const flag = [false];
        this.editHelper([json], data.id, data.card_type, data.card_logo, flag, hasOldGuide, config.guidance_document);
        this.editor.txt.html(json2html(json));
      }
      this.cardData[data.id] = data;
    },
    // 遍历寻找，并编辑，兼容老版本编辑逻辑
    editHelper(json, id, type, logo, flag, hasOldGuide, guidance_document) {
      if (flag[0] || !json || json.length === 0) return;
      for (let node of json) {
        if (node.tag && node.tag === 'consult-card') {
          if (node.attr['data-id'] && node.attr['data-id'] === id) {
            node.attr['card-type'] = type;
            node.attr['card-logo'] = logo;
            if (!hasOldGuide) {
              node.attr['card-show-content'] = `${guidance_document}/#id#/${id}`;
            }
            flag[0] = true;
          }
        }
        if (node.child && node.child.length > 0) {
          this.editHelper(node.child, id, type, logo, flag, hasOldGuide, guidance_document);
        }
      }
    },
    cancal() {
      this.currentCardType = '';
      this.contact_card = {};
    },
    setCard(e) {
      // this.contact_card = {
      //   type: val
      // };
      this.contact_card = {
        type: e.target.dataset.label
      };
    },
    //获取编辑器的内容 -- createContent.vue中调用
    getEditorContent() {
      let form = JSON.parse(JSON.stringify(this.content));
      if (this.info_type) {
        //上传视频时摘要就是内容
        form.abstract = this.abstract;
      } else {
        form.content = this.editor.txt.html(); // 通过代码获取编辑器内容
        let reg = /media-id="([0-9]\d{0,100})/g;
        let matchIds = form.content.match(reg);
        //过滤掉material中被删除的素材
        if (matchIds && matchIds.length) {
          let ids = matchIds.map((item) => {
            return parseInt(item.split('media-id="')[1]);
          });
          form.material = this.material.filter((element) => {
            return ids.indexOf(element.id) !== -1;
          });
        }
        form.content_json = this.editor.txt.getJSON(); //获取json
        //建联卡片操作-start
        let cardData = Object.values(this.cardData); //获取建联卡片组成的数组
        let contact_card = [];
        cardData.forEach((element) => {
          //二维码只留最后名称
          if (element.qr_code) {
            element.qr_code = element.qr_code.split('/')[element.qr_code.split('/').length - 1];
          }
          if (element.card_logo) {
            element.card_logo = element.card_logo.split('/')[element.card_logo.split('/').length - 1];
          }
          delete element.old_guidance_document;
          //过滤掉已被删除的建联卡片信息
          let text = new RegExp(`card-show-content=\"(.*)\/#id#\/${element.id}\"`);
          let cardIds = form.content.match(text);
          if (cardIds && cardIds.length) {
            contact_card.push(element);
          }
        });
        form.contact_card = contact_card;
        //建联卡片操作-end
      }
      return form;
    },
    //设置编辑器的内容
    setEditorContent(result) {
      this.$nextTick(() => {
        this.content = {
          title: result.title,
          author_name: result.author_name
        };
        console.log(this.info_type);
        if (!this.info_type) {
          this.material = result.material;
          this.editor.txt.html(result.content); // 重新设置编辑器内容
          result.contact_card.forEach((element) => {
            this.cardData[element.id] = element;
          });
          console.log(this.cardData, 1234);
        } else {
          this.abstract = result.abstract;
        }
      });
    },
    editInfo(id) {
      if (this.cardData[id].card_type && this.cardData[id].card_type === 2) {
        this.cardData[id].guidance_document = '';
      } else {
        this.cardData[id].card_logo = '';
      }
      this.contact_card = this.cardData[id];
    },
    showMaterialDialog(index) {
      !index ? this.$refs.materialImgDialog.showMaterialDialog() : this.$refs.materialVideoDialog.showMaterialDialog();
    },
    //选择素材的回调
    submitSucceed({ info, type }) {
      let html =
        type == 'video'
          ? `<qz-editor-media style="display: block;" type="video" poster="${info.cover_url}" src="${info.file_path}" data-path="${info.file_path}" data-id="${info.id}" media-id="${info.id}"></qz-editor-media>`
          : `<qz-editor-media style="display: block;" type="picture" src="${info.file_path}" data-path="${info.file_path}" data-id="${info.id}" media-id="${info.id}"></qz-editor-media>`;
      this.material.push({
        id: info.id,
        type: type ? 'video' : 'picture',
        key_word: JSON.stringify(info),
        sequence: this.material.length + 1,
        file_name: type ? info.file_path : info.file_name
      });
      this.editor.cmd.do('insertHTML', `${html}\r\n`);
      this.editor.cmd.do('insertHTML', '<p><br/></p>');
    },
    h60() {
      if (this.info_type) return { height: '60px' };
      return {};
    },
    // 上传成功
    async uploadSuccess(res) {
      let { status, result } = await api.saveImage({
        show_name: res.name,
        uid: localStorage.getItem('HARBOR_ID'),
        type: '0',
        path: res.result.full_url,
        name: res.result.file,
        width: res.width,
        height: res.height
      });
      if (status == 200) {
        this.submitSucceed({
          info: {
            file_name: res.result.file,
            file_path: res.result.full_url,
            id: result,
            img_type: 0,
            show_name: res.name
          },
          type: 0
        });
      }
    },
    // 上传失败
    uploadFailed(err) {
      console.log(err);
      this.$QzMessage({
        content: '当前网络环境较差，添加本地图片失败'
      });
      this.loading = false;
    },
    uploadError(err) {
      this.$message({
        message: err.msg,
        type: 'warning'
      });
      this.loading = false;
    },
    //触发文件上传的change事件调用组件方法
    handleFileChange(e) {
      this.$refs.filesEle.handleFileChange(e);
      this.loading = true;
    },
    // 点击该按钮触发文件控件的点击事件
    triggerFileInput() {
      this.$refs.fileEle1.click();
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }
  },
  watch: {
    //标题变化要更新预览区--后期迭代去掉了
    // 'content.title'() {
    //   let t = {
    //     title: this.content.title
    //   };
    //   if (this.info_type === 1) {
    //     t.abstract = this.abstract;
    //   }
    //   this.$emit('sendInfo', t);
    // },
    //摘要变化要更新预览区--后期迭代去掉了
    // abstract() {
    //   if (this.info_type === 1) {
    //     let t = {
    //       title: this.content.title,
    //       abstract: this.abstract
    //     };
    //     this.$emit('sendInfo', t);
    //   }
    // },
    scrollTop() {
      if (this.scrollTop > 125 && this.scrollTop < 650) {
        this.fixedClass = {
          position: 'fixed',
          top: '83px',
          'z-index': 500
        };
      } else {
        this.fixedClass = {};
      }
    }
  },
  computed: {},
  beforeDestroy() {
    if (this.editor) {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    }
  }
};
</script>
<style lang="scss">
.editor-main {
  ul,
  ol,
  dl,
  li,
  dt,
  dd,
  p,
  em,
  cite,
  del,
  strong,
  pre,
  code,
  address,
  fieldset,
  legend,
  table,
  caption,
  thead,
  th,
  tbody,
  td,
  tfoot {
    font-size: unset;
    font-style: unset;
    font-weight: unset;
    word-wrap: unset;
    outline: unset;
  }
  li {
    list-style: inherit;
    list-style-type: inherit;
  }
}
</style>
<style lang="scss">
#text-container {
  height: 460px;
  margin-top: 12px;
}
#toolbar-container {
  margin: 0 -20px;
  .toolbar-container {
    padding: 0;
    .toolbar-container {
      width: 30px;
      height: 30px;
    }
  }
}
.editor-main {
  margin-top: 24px;
  position: relative;
  padding: 0 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 0px 0px 4px 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);

  .btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px 10px;
    cursor: pointer;
  }
}
.consult-card-list {
  margin-top: 16px;
  .card-text {
    margin-left: 3px;
    margin-right: 3px;
    height: 22px;
    font-size: 14px;
    font-weight: bold;
    line-height: 22px;
  }
  &-container {
    display: inline-block;
    &-button {
      display: inline-block;
      border: 1px solid rgba(0, 0, 0, 0.12);
      height: 28px;
      line-height: 28px;
      margin: 0 5px;
      padding: 0 12px;
      border-radius: 5px;
      cursor: pointer;
    }
    &-button:hover {
      border: 1px solid #18cfdc;
      background: #eaf9fb;
      color: #15cfdc;
    }
  }
}

.w-e-menu {
  color: #02a7f0;
}

.editor-title-input .el-input__inner {
  border: 0;
  padding: 0;
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
  margin-top: 20px;
}
.editor-author-input .el-input__inner {
  margin-top: 15px;
  padding: 0;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid rgba(238, 235, 235, 1);
  border-top: 1px solid rgba(238, 235, 235, 1);
  line-height: 50px;
  height: 50px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
}
.w-e-text {
  padding: 0;
}
.w-e-text-container .placeholder {
  left: 0;
  height: 26px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.2);
  line-height: 26px;
}
.w-e-text p {
  // margin: 10px -10px;
  line-height: 1.5;
}
.w-e-toolbar .w-e-droplist ul.w-e-list li.w-e-item:hover {
  background-color: rgba(21, 207, 220, 0.08);
}
.abstract111 .el-textarea__inner {
  border: none;
  margin-top: 15px;
  font-size: 14px;
  margin-left: -15px;
}
</style>
