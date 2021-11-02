<template>
  <div>
    <!-- 写书评 -->
    <elForm>
      <el-form-item prop="2" :error="recommentError" class="form_label_w" label-width="10">
        <el-input
          class="mt12"
          type="textarea"
          v-bind="$attrs"
          :value="value"
          v-on:input="$emit('input', $event)"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </el-form-item>
    </elForm>
    <div class="textarea_bottom">
      <el-button size="mini" round @click="$emit('edit-cancel')">取消</el-button>
      <el-button size="mini" type="primary" round @click="$emit('edit-save')">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addComment',
  data() {
    return {};
  },
  props: ['value', 'recommentError'],
  methods: {}
};
</script>
<style lang="scss" scpoed></style>
