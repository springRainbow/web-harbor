<template>
  <div class="card">
    <div class="left">
      <img class="avatar" :src="dataInfo.user_icon_url" />
    </div>
    <div class="right">
      <div class="head">
        <div class="info-box">
          <p class="name" v-if="isChild && dataInfo.user_identity == 2" style="font-weight: bold">
            {{ dataInfo.user_name }}(作者)
          </p>
          <p class="name" v-else>
            {{ dataInfo.user_name }}
            <span class="tag" v-if="dataInfo.reply_num">已回复</span>
          </p>
          <p class="time">{{ dataInfo.format_date }}</p>
        </div>
        <div class="extra">
          <template v-if="dataInfo.user_id == userInfo.user.id">
            <span class="delete" @click="onDelete">删除</span>
          </template>
          <template v-else>
            <span class="replay" @click="onShowReplay">回复</span>
            <span class="delete line" @click="onDelete">删除</span>
          </template>
        </div>
      </div>
      <template v-if="isChild">
        <div class="content">
          回复 <span style="color: rgba(0, 0, 0, 0.5); margin: 0 8px">@{{ dataInfo.to_comment.user_name }}:</span>
          {{ dataInfo.content }}
        </div>
      </template>
      <div v-else class="content">{{ dataInfo.content }}</div>
      <div v-if="!isChild" class="replay-count" @click="onToggleReplay">
        共{{ dataInfo.reply_num }}条回复
        <i class="el-icon-arrow-up" v-if="visibleComment" />
        <i v-else class="el-icon-arrow-down" />
      </div>
      <com-replay
        v-model="visibleReplay"
        v-if="visibleReplay"
        :dataInfo="dataInfo"
        :obj_id="obj_id"
        @refreshList="refreshList"
      />
      <transition name="fade">
        <div v-if="visibleComment && replayList.length" class="replay-slot">
          <com-card
            v-for="ele in replayList"
            :key="ele.comment_id"
            :dataInfo="ele"
            :obj_id="obj_id"
            @refreshReplay="refreshList"
            :isChild="true"
          ></com-card>
          <el-pagination
            background
            layout="prev, pager, next, sizes, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-model="page"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="page_size"
            hide-on-single-page
          >
          </el-pagination>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import api from './api';
import ComReplay from './replay';
import { mapState } from 'vuex';

export default {
  name: 'ComCard',
  components: { ComReplay },
  props: ['dataInfo', 'isChild', 'obj_id'],
  data() {
    return {
      visibleReplay: false,
      visibleComment: false,
      page_size: 5,
      page: 1,
      total: 0,
      comment_id: '',
      replayList: []
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  created() {
    this.comment_id = this.dataInfo.comment_id;
  },
  methods: {
    refreshList() {
      if (this.isChild) {
        this.$emit('refreshReplay');
      } else {
        this.dataInfo.reply_num = 1 + Number(this.dataInfo.reply_num);
        if (this.visibleComment) {
          this.getReplayList();
        }
      }
    },
    onShowReplay() {
      this.visibleReplay = true;
    },
    onDelete() {
      let msg = '删除评论后，用户无法看到评论，确定删除这条评论吗？';
      if (this.isChild) {
        msg = '删除评论回复后，用户无法看到该回复，确定删除这条回复吗？';
      }
      this.$confirm(msg, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api
          .postdelete({
            comment_id: this.comment_id
          })
          .then(() => {
            this.$message.success('删除成功');
            this.$emit('refreshList');
          });
      });
    },
    onToggleReplay() {
      if (this.visibleComment) {
        this.visibleComment = false;
      } else {
        this.page = 1;
        this.getReplayList().then(() => {
          this.visibleComment = true;
        });
      }
    },
    getReplayList() {
      let { page_size, page, comment_id, obj_id } = this;
      return new Promise((resolve, reject) => {
        api
          .getReplayList({
            page,
            page_size,
            comment_id,
            obj_id
          })
          .then(({ status, result }) => {
            if (status === 200) {
              this.total = result.total;
              this.replayList = result.data;
              resolve();
            }
          });
      });
    },
    handleSizeChange(v) {
      this.page_size = v;
      this.getReplayList();
    },
    handleCurrentChange(v) {
      this.page = v;
      this.getReplayList();
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding-top: 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  .left {
    margin-right: 8px;
    .avatar {
      display: block;
      height: 36px;
      width: 36px;
      border-radius: 50%;
    }
  }
  .right {
    flex: 1;
    .head {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .info-box {
        .name {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.8);
          line-height: 19px;
          .tag {
            margin-left: 12px;
            padding: 1px 8px;
            display: inline-block;
            background: rgba(162, 167, 177, 0.08);
            border-radius: 4px;

            font-size: 11px;
            font-weight: 400;
            color: #a2a7b1;
            line-height: 18px;
          }
        }
        .time {
          margin-top: 6px;
          font-size: 10px;
          color: rgba(0, 0, 0, 0.3);
        }
      }
      .extra {
        .replay {
          cursor: pointer;
          color: $mainColor;
        }
        .delete {
          cursor: pointer;
          color: $dangerColor;
        }
        .line {
          @include common-space_line(12px);
        }
      }
    }
    .content {
      margin-top: 13px;
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.8);
    }
    .replay-count {
      text-align: right;
      margin-top: 8px;
      margin-bottom: 20px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 22px;
      cursor: pointer;
    }
    .replay-slot {
      background: rgba(248, 248, 248, 1);
      border-radius: 4px;
      padding: 16px;
    }
  }
}
.card:not(:last-child) {
  .right {
    padding-bottom: 16px;
    border-bottom: 1px solid #dedede;
  }
}
</style>

<style lang="scss" scope>
.fade-enter-active {
  transform-origin: 50% 0 0;
  animation: fade-in 0.2s ease-out;
}
.fade-leave-active {
  transform-origin: 50% 0 0;
  animation: fade-in 0.2s ease-out reverse;
}
@keyframes fade-in {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
