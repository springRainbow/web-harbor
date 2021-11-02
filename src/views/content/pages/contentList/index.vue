<template>
  <div class="content-all">
    <div style="position: relative">
      <el-tabs v-model="audit_flag" @tab-click="handleClick">
        <el-tab-pane label="已发布" name="2"></el-tab-pane>
        <el-tab-pane label="未过审" name="1"></el-tab-pane>
        <el-tab-pane label="审核中" name="0"></el-tab-pane>
        <el-tab-pane label="草稿箱" name="-1"></el-tab-pane>
      </el-tabs>
      <el-dropdown style="position: absolute; top: 3px; right: 0px" @command="toCreate" szie="medium">
        <el-button type="primary">+ 新的创作</el-button>
        <el-dropdown-menu slot="dropdown" class="content-dropdown">
          <el-dropdown-item :command="0">图文</el-dropdown-item>
          <el-dropdown-item :command="1">视频</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-form ref="form" :model="form" inline label-width="90px">
      <el-form-item
        :label="`${audit_flag == 2 ? '上线时间：' : '发布时间：'}`"
        v-if="audit_flag == 2 || audit_flag == 0"
        prop="publish_time"
      >
        <el-date-picker
          v-model="form.publish_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          suffix-icon="el-icon-date"
          class="w220"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="未过审/下线时间：" v-if="audit_flag == 1" label-width="140px" prop="offline_time">
        <el-date-picker
          v-model="form.offline_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          suffix-icon="el-icon-date"
          class="w220"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间：" v-if="audit_flag == -1" prop="updated_time">
        <el-date-picker
          v-model="form.updated_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          suffix-icon="el-icon-date"
          class="w220"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="内容标签：" prop="tag_name" v-if="audit_flag != -1">
        <el-input v-model="form.tag_name" suffix-icon="el-icon-search" placeholder="请输入标签" class="w190"></el-input>
      </el-form-item>
      <el-form-item label="内容标题：" prop="news_title">
        <el-input
          v-model="form.news_title"
          suffix-icon="el-icon-search"
          placeholder="请输入标题"
          class="w190"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini">查询</el-button>
        <el-button plain @click="reset" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
    <qzTable
      ref="searchResultList"
      :options="gridOptions"
      :serviceInstanceScreen="serviceInstanceScreen"
      @size-change="sizeChange"
      @data-change="dataChange"
    >
    </qzTable>
    <Preview ref="preview"></Preview>
    <com-comment v-model="showDrawer" :id="comment_id" />
    <div class="consult-card" v-if="showPublish">
      <div class="card-title-area">
        <span class="card-title">修改发布时间</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="发布时间" required="">
          <el-date-picker
            v-model="ruleForm.datetime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <p class="tit-tips">发布后，内容会展示到APP对应板块内，确定发布吗？</p>
        <el-form-item style="text-align: right; margin-top: 12px; margin-bottom: 0px">
          <el-button plain @click="cancal" size="mini">取消</el-button>
          <el-button type="primary" plain @click="changePublishTime()" size="mini">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="m-modal" v-if="showPublish"></div>
    <div class="no-content-aera" v-if="!list.length">
      <img class="no-content-image" src="~@/assets/bg-no-content.png" alt="" v-if="audit_flag == 0" />
      <img class="no-content-image" src="~@/assets/bg-no-task.png" alt="" v-if="audit_flag != 0" />
      <p class="no-content" v-if="audit_flag == 0">暂无内容在审核，可以去发布一篇哦！</p>
      <p class="no-content" v-if="audit_flag == 2">您还没有发布任何内容，可以去右上角发布新的创作哈！</p>
      <p class="no-content" v-if="audit_flag == 1">您没有未过审内容，非常棒！</p>
      <p class="no-content" v-if="audit_flag == -1">草稿箱空空如也，快去发布新的创作吧！</p>
    </div>
    <NewsLog ref="newsLog"></NewsLog>
    <ExamineLogs ref="ExamineLogs"></ExamineLogs>
  </div>
</template>
<script>
import api from '../../_api';
import Preview from './components/Preview.vue';
import NewsLog from './components/NewsLog.vue';
import ExamineLogs from './components/ExamineLogs.vue';
import ComComment from '@/components/Comment/index';

export default {
  name: 'contentList',
  data() {
    return {
      showDrawer: false,
      showPublish: false,
      audit_flag: '',
      comment_id: '',
      form: {
        tenant_uuid: localStorage.getItem('HARBOR_ID'),
        tag_name: '',
        news_title: '',
        publish_time: [],
        updated_time: [],
        offline_time: []
      },
      ruleForm: {
        datetime: '',
        uuid: ''
      },
      pickerOptions: {
        //设置时间选择器的禁用时间
        disabledDate(time) {
          let a = time.getTime() > Date.now() + 3600 * 1000 * 24 * 7;
          let b = time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          return a || b;
        }
      },
      list: [],
      playerIcon: require('@/assets/player@2x.png'),
      tipImageIcon: require('@/assets/tip@2x.png'),
      currentPageSize: 10
    };
  },
  components: {
    Preview,
    ComComment,
    NewsLog,
    ExamineLogs
  },
  mounted() {
    this.audit_flag = this.$route.query.audit_flag || '2';
  },
  created() {},
  computed: {
    serviceInstanceScreen() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (form.publish_time && form.publish_time.length) {
        form.publish_time = this.getAllTime(form.publish_time);
      }
      if (form.offline_time && form.offline_time.length) {
        form.offline_time = this.getAllTime(form.offline_time);
      }
      if (form.updated_time && form.updated_time.length) {
        form.updated_time = this.getAllTime(form.updated_time);
      }
      return Object.assign({}, form, { audit_flag: this.audit_flag });
    },

    gridOptions() {
      let gridOptions = {
        dataSource: {
          serviceInstance: api.getNewsList,
          loadDataOnFirst: false
          // serviceInstance: []
        },
        grid: {
          highlightCurrentRow: false,
          pageable: true,
          pagination: {
            background: true,
            pageSizes: [10, 30, 50],
            pageSize: this.currentPageSize,
            showSizes: true,
            'current-page': 1
          },
          operates: {
            width: 240,
            list: []
          },
          columns: [
            {
              width: 240,
              label: '封面',
              formatter: (row, column, cellValue) => {
                let str = "<span class='cover-span'>";
                str += row.cover ? `<img class="cover-image" src='${row.cover}' />` : '';
                if (row.info_type) {
                  str += ` <img src="${this.playerIcon}" class="player-icon-list"/>`;
                }
                return str + '</span>';
              }
            },
            {
              label: '标题',
              formatter: (row, column, cellValue) => {
                let str = `<p class="content-title">${row.title}</p>`;
                return str;
              }
            },
            {
              formatter(row, column, cellValue) {
                return (row.publish_updated_at || row.updated_at).split(' ')[0];
              },
              header: this.headerFormatter
            },
            {
              header: this.headerOffline,
              visible: false,
              formatter(row, column, cellValue) {
                return row.offline_time.split(' ')[0];
              }
            },
            {
              width: 200,
              header: this.headerReason,
              visible: false,
              render: this.showExamineLogs
            }
          ]
        }
      };
      if (['2', '1', '0', '-1'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '预览',
          method: this.doPreview
        });
      }
      if (['2', '1', '-1'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '编辑',
          method: this.doEdit
        });
      }
      if (['2'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '下线',
          style: 'color:#ED4046',
          method: this.doOffline
        });
      }
      if (['2'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '查看评论',
          method: this.toViewComments
        });
      }
      if (['-1'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '日志',
          method: this.toViewLog
        });
      }
      if (['1', '-1'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '删除',
          style: 'color:#ED4046',
          method: this.doDelete
        });
      }
      if (['0'].indexOf(this.audit_flag) != -1) {
        gridOptions.grid.operates.list.push({
          type: 'text',
          label: '修改发布时间',
          method: this.toChangeTime,
          show: (key, row) => {
            let { publish_type } = row;

            return publish_type == 1;
          }
        });
      }
      return gridOptions;
    }
  },
  methods: {
    getAllTime(time) {
      return [time[0] + ' 00:00:00', time[1] + ' 23:59:59'];
    },
    handleClick() {
      if (this.audit_flag == 1) {
        this.gridOptions.grid.columns[3].visible = true;
        this.gridOptions.grid.columns[4].visible = true;
      } else {
        this.gridOptions.grid.columns[3].visible = '';
        this.gridOptions.grid.columns[4].visible = '';
      }
      this.$nextTick(() => {
        this.$refs.searchResultList.clear();
        this.reset();
      });
    },
    toCreate(index) {
      this.$router.push(`/content/createContent?info_type=${index}&u=${this.$route.query.u}`);
    },
    doPreview(key, row) {
      this.$refs.preview.showPreview(row.uuid, this.audit_flag == -1 ? 'draft' : 'publish');
    },
    doEdit(key, row) {
      console.log(row);
      let url = `/content/createContent?u=${this.$route.query.u}&info_type=${row.info_type}`;
      if (this.audit_flag == -1) {
        url += `&uuid=${row.uuid}`;
      } else {
        url += `&news_uuid=${row.uuid}`;
      }
      this.$router.push(url);
    },
    doOffline(key, row) {
      let _this = this;
      this.$prompt('', '下线稿件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入下线原因',
        inputType: 'textarea',
        showClose: false
      })
        .then(({ value }) => {
          _this.offline(value, row.uuid);
        })
        .catch(() => {});
    },
    async offline(remark, uuid) {
      let { status } = await api.doOffline({
        uuid,
        remark
      });
      if (status == 200) {
        this.$message.success('下线成功');
        this.$refs.searchResultList.refresh();
      }
    },
    toChangeTime(key, row) {
      this.ruleForm.uuid = row.uuid;
      this.showPublish = true;
    },
    cancal() {
      this.showPublish = false;
    },
    async changePublishTime() {
      let { status, message } = await api.changePublishTime(this.ruleForm);
      if (status == 200) {
        this.$refs.searchResultList.refresh();
        this.ruleForm.datetime = '';
      } else {
        this.$message.error(message);
      }
    },
    toViewComments(key, row) {
      this.comment_id = row.uuid;
      this.showDrawer = true;
    },
    doDelete(key, row) {
      this.$confirm('删除稿件后，该稿件将被彻底删除，确定删除这个稿件吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(async () => {
          let { status } = await api.doDelete(this.audit_flag == -1 ? { drafts_uuid: row.uuid } : { uuid: row.uuid });
          if (status == 200) {
            this.$refs.searchResultList.refresh();
          }
        })
        .catch(() => {});
    },
    toViewLog(key, row) {
      this.$refs.newsLog.getNewsLog(row.uuid);
    },

    search() {
      this.$refs.searchResultList.refresh();
    },
    reset() {
      this.$refs.form.resetFields();
      (this.form = {
        tenant_uuid: localStorage.getItem('HARBOR_ID'),
        tag_name: '',
        news_title: '',
        publish_time: [],
        updated_time: [],
        offline_time: []
      }),
        this.$refs.searchResultList.refresh();
    },
    headerOffline(h, ctx) {
      return h('div', {}, [
        h(
          'span',
          {
            style: {
              'font-size': '14px',
              'font-weight': 'bold',
              'margin-right': '8px'
            }
          },
          '未过审/下线时间'
        ),
        h(
          'el-tooltip',
          {
            attrs: {
              src: this.tipImageIcon
            },
            props: {
              content: '内容未过审被驳回或主动下线内容的时间',
              placement: 'bottom',
              'popper-class': 'popper-class'
            },
            style: {}
          },
          [
            h('img', {
              attrs: {
                src: this.tipImageIcon
              },
              style: {
                width: '16px',
                verticalAlign: 'middle'
              }
            })
          ]
        )
      ]);
    },
    headerReason(h) {
      return h('div', {}, [
        h(
          'span',
          {
            style: {
              'font-size': '14px',
              'font-weight': 'bold',
              'margin-right': '8px'
            }
          },
          '原因'
        ),
        h(
          'el-tooltip',
          {
            attrs: {
              src: this.tipImageIcon
            },
            props: {
              content: '点击可查看未过审原因详情',
              placement: 'bottom',
              'popper-class': 'popper-class'
            },
            style: {}
          },
          [
            h('img', {
              attrs: {
                src: this.tipImageIcon
              },
              style: {
                width: '16px',
                verticalAlign: 'middle'
              }
            })
          ]
        )
      ]);
    },
    headerFormatter(h, ctx) {
      // 1未过审-发布时间，2已发布-上线时间，0审核中-发布时间，-1草稿箱-更新时间
      if (this.audit_flag != 2) {
        return h(
          'span',
          {
            style: {
              'font-size': '14px',
              'font-weight': 'bold',
              'margin-right': '8px'
            }
          },
          this.audit_flag > -1 ? '发布时间' : '更新时间'
        );
      } else {
        return h('div', {}, [
          h(
            'span',
            {
              style: {
                'font-size': '14px',
                'font-weight': 'bold',
                'margin-right': '8px'
              }
            },
            '上线时间'
          ),
          h(
            'el-tooltip',
            {
              attrs: {
                src: this.tipImageIcon
              },
              props: {
                content: '内容过审后用户可见的时间',
                placement: 'bottom',
                'popper-class': 'popper-class'
              },
              style: {}
            },
            [
              h('img', {
                attrs: {
                  src: this.tipImageIcon
                },
                style: {
                  width: '16px',
                  verticalAlign: 'middle'
                }
              })
            ]
          )
        ]);
      }
    },
    dataChange({ result }) {
      this.list = result.data;
    },
    showExamineLogs(h, ctx) {
      return h(
        'span',
        {
          props: {},
          style: {
            color: '#15cfdc',
            'font-weight': 'bold',
            cursor: 'pointer'
          },
          on: {
            click: () => this.clickHandler(ctx.row.examineLogs)
          }
        },
        ctx.row.violationDesc
      );
    },
    clickHandler(list) {
      this.$refs.ExamineLogs.init(list);
    },
    sizeChange(size) {
      this.currentPageSize = size;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './components/card.scss';

.content-all {
  padding: 24px 32px;
  .w220 {
    width: 220px;
  }
  .w190 {
    width: 190px;
  }
  /deep/ .el-table .el-button--small {
    padding: 0;
    margin-left: 0;
  }
  /deep/.el-table .el-button span {
    padding-right: 8px;
    padding-left: 8px;
  }
  /deep/.el-table .el-button:not(:last-child) span {
    border-right: 1px solid #d8d8d8;
  }
  /deep/ .el-pagination {
    margin-top: 20px;
    margin-right: 20px;
    position: absolute;
    right: 20px;
  }
}
.consult-card {
  width: 320px;
}
.table {
  position: unset;
}

.no-content-aera {
  position: relative;
  top: -54px;
  z-index: 100;
  background: #fff;
  text-align: center;
}
.no-content-image {
  position: relative;
  width: 394px;
  margin-top: 100px;
}
.no-content {
  height: 19px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 19px;
  text-align: center;
}
</style>
<style lang="scss">
.el-message-box {
  .el-textarea__inner {
    // width: 296px;
    height: 82px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #cccccc;
  }
}
</style>
<style>
.cover-span {
  display: block;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 4px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  position: relative;
}
.player-icon-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 32px;
}
.cover-image {
  vertical-align: middle;
  max-width: 100%;
  max-height: 100%;
}
.tit-tips {
  margin-left: 8px;
  height: 22px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
}
.content-title {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.el-tooltip__popper.popper-class {
  background: #fff;
  padding: 27px 18px;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);

  box-shadow: 0px 8px 28px 8px rgba(0, 0, 0, 0.02), 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 2px 6px -2px rgba(0, 0, 0, 0.12);
}
.content-dropdown.el-dropdown-menu--small .el-dropdown-menu__item {
  padding: 0 36px;
}
</style>
