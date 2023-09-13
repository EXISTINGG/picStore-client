<template>
  <div class="about-page">
    <nav class="navbar">
      <div class="goback" @click="router.back()">
        <el-icon><ArrowLeftBold /></el-icon>返回
      </div>
      <h2>关于</h2>
    </nav>
    <div class="background"></div>
    <div class="content">
      <h2>关于 Existing图床</h2>
      <p>Existing图床是一个专注于图片托管和分享的平台。</p>

      <h3>我们的技术栈</h3>
      <p>
        Existing图床的后端由Express构建，确保服务器稳定运行，同时提供高效的图片上传和分享功能。前端则采用Vue3技术，为用户提供流畅的操作体验。
      </p>

      <h3>图片检测</h3>
      <p>
        为了维护一个健康的网络环境，我们引入了nsfwjs技术，自动检测上传的图片，以确保图床上的内容是安全和适宜的。
      </p>

      <h3>用户友好</h3>
      <p>
        我们的目标是提供一个公共性图床，让用户能够安全、方便地分享图片资源。您可以上传图片，获得唯一的链接，并轻松在各个平台进行分享和引用。同时，我们还提供了简单的图片管理功能，方便您管理上传的资源。
      </p>

      <h3>联系我们</h3>
      <p>
        如有任何问题或反馈，请随时联系我们。您可以通过以下方式与我们取得联系：<a
          href="mailto:existingpicstore@qq.com"
          >existingpicstore@qq.com</a
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
const router = useRouter()
</script>

<style lang="scss" scoped>
.about-page {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}

.navbar,
.content {
  background: rgba(255, 255, 255, 0.8); /* 内容区域背景，根据需要调整 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.navbar {
  position: relative;
  display: flex;
  align-items: center;

  .goback {
    display: flex;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
  }

  h2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('../assets/bg/gybg-2.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  opacity: 0.5; /* 背景透明度，根据需要调整 */
}

.content {
  margin-top: 20px;
}

h2 {
  font-size: 24px;
  margin-top: 0;
}

h3 {
  font-size: 18px;
  margin-top: 20px;
}

p {
  font-size: 16px;
  line-height: 1.5;
  margin-top: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
