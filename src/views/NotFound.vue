<template>
  <div class="user-body">
    <h1 class="not-found">404</h1>
    <p class="message">哎呀！您要查找的页面不存在。</p>
    <button class="back-button" @click="router.go(-1)">返回</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.user-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  background: url('../assets/bg/gybg-3.jpg') no-repeat center/cover;
  font-family: 'Arial', sans-serif;
  color: white;
}

.not-found {
  font-size: 6rem;
  font-family: 'Helvetica Neue', sans-serif;
  margin-bottom: 20px;
  user-select: none;
}

.message {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 20px;
  user-select: none;
}

.back-button {
  padding: 10px 30px;
  font-size: 1rem;
  border: 10px solid #fff;
  border-radius: 50px;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.back-button:hover {
  background: white;
  color: black;
}

/* 媒体查询：在小屏幕上进行调整 */
@media screen and (max-width: 768px) {
  .not-found {
    font-size: 4rem;
  }

  .message {
    font-size: 1.2rem;
  }

  .back-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
