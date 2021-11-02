<template>
  <div class="component-replay">
    <div class="replay-box">
      <div class="name">@{{ dataInfo.user_name }}</div>
      <el-input
        ref="textarea"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 6 }"
        placeholder="请输入回复内容"
        v-model="content"
      />
    </div>
    <div class="btn-box">
      <el-button size="mini" plain round @click="onClose">取消</el-button>
      <el-button size="mini" type="primary" round @click="onSubmit">发送</el-button>
    </div>
  </div>
</template>

<script>
import api from './api';

export default {
  name: 'comment',
  props: ['dataInfo', 'obj_id'],
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    this.$refs.textarea.focus();
  },
  methods: {
    onClose() {
      this.$emit('input', false);
    },
    onSubmit() {
      if (this.content == '') {
        this.$message.error('请输入回复内容');
        return;
      }
      api
        .postReplay({
          content: this.content,
          obj_id: this.obj_id,
          to_comment_id: this.dataInfo.comment_id,
          obj_type: '101'
        })
        .then(() => {
          this.$message.success('回复成功');
          this.onClose();
          this.$emit('refreshList');
        });
    }
  }
};
</script>

<style lang="scss">
.component-replay {
  margin-top: 12px;
  margin-bottom: 12px;

  .replay-box {
    padding: 8px 20px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: #fff;
    font-size: 14px;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    .el-textarea {
      .el-textarea__inner {
        caret-color: $mainColor;
        background: transparent;
        border: 0;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
  .btn-box {
    margin-top: 8px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
}
</style>
