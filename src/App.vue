<template>
<!-- 加载动画，解决以服务的方式调用动画不在中心的bug -->
  <i v-loading.fullscreen.lock="fullscreenLoading"></i>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"  v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <component :is="Component"  v-if="!$route.meta.keepAlive"/>
  </router-view> 
</template>

<script setup>
import {ref} from 'vue'
const fullscreenLoading = ref(false)
</script>
