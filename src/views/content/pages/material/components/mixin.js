import api from '../../../_api';

export const mixins = {
  data() {
    return {
      delArray: [],
      checkBoxShow: false
    };
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
      this.checkBoxShow = false;
      this.delArray = [];
    },
    selectId(id) {
      if (this.checkBoxShow) {
        const index = this.delArray.indexOf(id);
        if (index !== -1) {
          this.delArray.splice(index, 1);
        } else {
          this.delArray.push(id);
        }
      }
    },
    cancal() {
      this.checkBoxShow = false;
      this.delArray = [];
    },
    submit(type) {
      let _this = this;
      this.$confirm(`确定删除选中的${type ? '视频' : '图片'}素材吗？`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(async () => {
          let len = _this.delArray.length;
          if (len) {
            let { result, status, message } = await api.delMaterial({
              type: type,
              ids: _this.delArray.join()
            });
            if (status == 200) {
              _this.$QzMessage({
                content: `删除了${result}个文件`
              });
              _this.reset();
              _this.$emit('deleteSuccess', _this.list.length == len ? true : false);
            } else {
              _this.$message({
                message: message,
                type: 'error'
              });
            }
          }
        })
        .catch(() => {});
    }
  }
};
