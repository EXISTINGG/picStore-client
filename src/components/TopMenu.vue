<template>
<el-affix >
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    router
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item>Existing图床</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="0">---</el-menu-item>
    <el-sub-menu index="1">
      <template #title><el-icon><PictureFilled /></el-icon>图片服务</template>
       <el-sub-menu index="1-1">
        <template #title><el-icon><UploadFilled /></el-icon>上传图片</template>
        <el-menu-item index="/upload">本地图片</el-menu-item>
        <el-menu-item index="/urlupload">网络图片</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="1-2">
        <template #title><el-icon><WarningFilled /></el-icon>图片检测</template>
        <el-menu-item index="/checkimg">本地图片</el-menu-item>
        <el-menu-item index="/urlcheck">网络图片</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="" @click="randomImg"><el-icon><PictureFilled /></el-icon>随机一图</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title><el-icon><Operation /></el-icon>更多</template>
      <el-menu-item index="/about"><el-icon><InfoFilled /></el-icon>关于</el-menu-item>
      <el-menu-item index=""><el-icon><Document /></el-icon><el-link href="https://apifox.com/apidoc/shared-f374e904-a169-44ee-82e6-5639683ab7db" target="_blank">开放API</el-link></el-menu-item>
      <el-sub-menu index="2-4">
        <template #title><el-icon><Promotion /></el-icon>开源地址</template>
        <el-menu-item index="2-4-1">前端</el-menu-item>
        <el-menu-item index="2-4-2">后端</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-sub-menu index="3" v-if="isloginStatus">
      <template #title><el-icon><Avatar /></el-icon>{{loginStore.user.username}}</template>
      <el-menu-item index="/user"><el-icon><Tools /></el-icon>账户设置</el-menu-item>
      <el-menu-item index="/admin" v-if="loginStore.user.power == 1 || loginStore.user.power == 2"><el-icon><Cpu /></el-icon>后台管理</el-menu-item>
      <el-menu-item index="" @click="logOut"><el-icon><SwitchButton /></el-icon>退出登录</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/login" v-else><el-icon><UserFilled /></el-icon>注册/登录</el-menu-item>
  </el-menu>
  </el-affix>
</template>

<script setup>
import { ref ,reactive, watch} from 'vue'
import axios from 'axios'
import {UploadFilled,UserFilled,Avatar,InfoFilled,Promotion,PictureFilled,WarningFilled,Tools,Operation,SwitchButton,Cpu,Document} from '@element-plus/icons-vue'
import {useLoginStore} from '@/store/login'
import {warning} from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'

const loginStore = useLoginStore()

const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
const randomImgUrl = ref('')

// 是否是登录状态
const isloginStatus = ref(false)
// 获取token和user,如果为空,就判定为没登陆
const loginStatus = () => {
  if(getItem('TOKEN') != '' && getItem('user') != '') {
    return isloginStatus.value = true
  } else {
    isloginStatus.value = false
  }
}
// 页面挂载准备好时,调用函数检查登录状态
loginStatus()

// 退出登录
const logOut = () => {
  loginStore.logOutFun().then(() => {
    // 退出登陆后,检查登录状态
    loginStatus()
  })
}

const randomImg = async () => {
  const {data} = await axios.get('https://picapi.hxq-001.top/file/api/randomimg')
  if(data.status !== 200) return warning(data.message)
  window.open(data.url)
}
</script>

<style lang="scss">
// .el-menu--horizontal{
//   /* width: 100%; */
//     background-image: radial-gradient(transparent 1px,#ffffff 1px);
//     background-size: 4px 4px;
//     backdrop-filter: saturate(200%) blur(40px);
//     background: #000;
// }

.el-menu--popup {
    // z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: center;
    min-width: 100px;
    // border: none;
    // padding: 0.13333rem 0;
    // border-radius: var(--el-border-radius-small);
    // box-shadow: var(--el-box-shadow-light);
}


.flex-grow {
  flex-grow: 1;
}
</style>
