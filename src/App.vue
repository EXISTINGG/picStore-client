<template>
<!-- 加载动画，解决以服务的方式调用动画不在中心的bug -->
  <i v-loading.fullscreen.lock="fullscreenLoading"></i>
  <router-view></router-view>
</template>

<script setup>
import {ref} from 'vue'
const fullscreenLoading = ref(false)
</script>
