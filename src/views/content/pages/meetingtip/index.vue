<template>
  <div class="dialog-container">
    1）在浏览器中打开QQ推广网站
    <a href="https://shang.qq.com/v3/index.html" target="_blank">https://shang.qq.com/v3/index.html</a><br />
    2）使用qq账号密码或手机qq扫码登录<br />
    <img :src="urls[0]" @click.stop="previewImg(urls[0])" /><br />
    3）打开推广工具--个人qq通讯组建--复制会话链接地址（图中红框位置，引号内部分）<br />
    <img :src="urls[1]" @click.stop="previewImg(urls[1])" /><br />
    4）将此链接粘贴到会话地址中。<br />
    这样用户在考研帮app中看到建联卡片后点击可直接调起qq，进入会话页面。<br />
    <img :src="urls[2]" @click.stop="previewImg(urls[2])" /><br />
    5）获取qq群链接<br />
    在推广工具页面中点击一键加群。<br />
    <img :src="urls[3]" @click.stop="previewImg(urls[3])" /><br />
    进入此页面后选择希望用户进入的群，然后复制群链接。<br />
    <img :src="urls[4]" @click.stop="previewImg(urls[4])" /><br />
    将此链接粘贴到会话地址中。这样用户在考研帮app中看到建联卡片后点击可直接调起qq，进入加群页面。<br />
    <img :src="urls[5]" @click.stop="previewImg(urls[5])" /><br />
  </div>
</template>

<script>
// 会议链接填写提示图
import meetting_tip_img0 from '@/assets/meeting2.png';
import meetting_tip_img1 from '@/assets/meeting3.png';
import meetting_tip_img2 from '@/assets/meeting4.png';
import meetting_tip_img3 from '@/assets/meeting5.png';
import meetting_tip_img4 from '@/assets/meeting6.png';
import meetting_tip_img5 from '@/assets/meeting7.png';
export default {
  data() {
    return {
      urls: [
        meetting_tip_img0,
        meetting_tip_img1,
        meetting_tip_img2,
        meetting_tip_img3,
        meetting_tip_img4,
        meetting_tip_img5
      ]
    };
  },
  methods: {
    previewImg(url) {
      this.$hevueImgPreview(url);
    }
  }
};
</script>

<style scoped>
img {
  width: 80%;
}
.dialog-container {
  padding: 24px;
}
a {
  color: rgba(0, 0, 204, 1);
}
a:hover {
  color: rgba(0, 0, 0, 0.4);
}
</style>
