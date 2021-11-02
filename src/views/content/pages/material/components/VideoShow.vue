<template>
  <div class="video-show">
    <el-dialog :title="name" :visible.sync="dialogTableVisible" destroy-on-close width="700px">
      <video
        id="myVideo"
        class="video-js vjs-default-skin vjs-big-play-centered"
        controls
        preload="auto"
        data-setup="{}"
        style="width: 100%; max-width: 100%; max-height: 400px; overflow: hidden"
      ></video>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../../_api';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
export default {
  name: '',
  data() {
    return {
      dialogTableVisible: false,
      src: '',
      name: '',
      player: null
    };
  },
  created() {},
  methods: {
    async init(path, name) {
      if (this.player) {
        this.player.dispose();
        this.player = null;
      }
      this.dialogTableVisible = true;
      let { result } = await api.getVideoRealPath(path);
      this.$nextTick(() => {
        this.player = videojs('myVideo', {
          sources: [
            {
              src: result.addrs[0].addr,
              type: 'application/x-mpegURL'
            }
          ],
          live: true,
          muted: false, //设置默认播放音频：true/false
          // fluid: true,
          techOrder: ['html5'],
          height: 400
        });
        this.player.play();
        this.name = name;
      });
    }
  },
  computed: {},
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
<style lang="scss" scoped>
.video-show {
  /deep/.el-dialog__body {
    height: 400px;
  }
  .video-js {
    background: unset;
  }
}
</style>
