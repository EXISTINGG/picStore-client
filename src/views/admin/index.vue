<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse ? '80px' : '200px'" class="aside">
        <!-- logo -->
        <div class="logo">{{isCollapse ? 'E' : 'Existing图床'}}</div>

        <!-- menu -->
        <el-menu
          :default-active="defaultRouter"
          class="el-menu-vertical-demo"
          background-color="#191a23"
          text-color="#ffffff"
          :collapse-transition="false"
          :collapse="isCollapse"
          router
        >
          <el-sub-menu index="/admin/user">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/user/userlist">用户列表</el-menu-item>
            <el-menu-item index="/admin/user/deleteuser"
              >已注销用户</el-menu-item
            >
          </el-sub-menu>
          <el-sub-menu index="/admin/api/">
            <template #title>
              <el-icon><Platform /></el-icon>
              <span>API管理</span>
            </template>
            <el-menu-item index="/admin/api/apilist">API列表</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <div class="fold-expand">
              <el-icon v-show="!isCollapse" @click="handleOpen" :size="28"
                ><Fold
              /></el-icon>
              <el-icon v-show="isCollapse" @click="handleOpen" :size="28"
                ><Expand
              /></el-icon>
            </div>
            <!-- <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
              <el-breadcrumb-item :to="{ path: '/admin/user/userlist' }"
                >homepage</el-breadcrumb-item
              >
            </el-breadcrumb> -->
          </div>

          <div class="header-right">
            <span class="icon-area">
              <el-icon :size="28" @click="router.push('/home')"
                ><House
              /></el-icon>
              <el-icon
                :size="25"
                @click="isFullScreen ? exitFullScreen() : handelFullScreen()"
                ><FullScreen
              /></el-icon>
            </span>
            <div class="avator-box">
              <el-avatar :size="40" :src="randomImgUrl"> </el-avatar>
              <i>{{loginStore.user.username}}</i>
            </div>
          </div>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <el-scrollbar max-height="85vh">
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import {
  UserFilled,
  Platform,
  Fold,
  Expand,
  ArrowRight,
  House,
  FullScreen
} from '@element-plus/icons-vue'
import {useLoginStore} from '@/store/login'


const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()

const defaultRouter = ref(route.path)
console.log(defaultRouter.value)
// 是否 折叠面板
const isCollapse = ref(false)
// 是否是全屏
const isFullScreen = ref(false)
// 全屏
const handelFullScreen = () => {
  document.documentElement.requestFullscreen()
  isFullScreen.value = true
}
// 退出全屏
const exitFullScreen = () => {
  document.exitFullscreen()
  isFullScreen.value = false
}
// 打开关闭折叠面板
const handleOpen = () => {
  isCollapse.value = !isCollapse.value
}

const randomImgUrl = ref('')
const randomImg = async () => {
  const { data } = await axios.get(
    'https://picapi.hxq-001.top/file/api/randomimg'
  )
  if (data.status !== 200) return
  randomImgUrl.value = data.url
}

onMounted(() => {
  randomImg()
})
</script>

<style lang="scss">
.aside {
  height: 100vh;
  background: #191a23;
  color: #ffffff;

  // 收缩时菜单的边框
  .el-menu--collapse {
    border: none !important;
  }

  .logo {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    text-shadow: 0 0 10px #fff, 0 0 10px #fff;
  }

  .el-menu-vertical-demo {
    // 选中的的菜单
    .el-menu-item.is-active {
      background: #4d70ff;
      color: #fff;
      border-radius: 10px;
      // margin:0 10px;
    }

    .el-menu-item.is-active:hover {
      background: #4d70ff !important;
    }

    // 鼠标悬浮在菜单
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
      text-shadow: 0 0 10px #fff, 0 0 20px #fff;
      background: rgb(67, 74, 80) !important;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  .header-left {
    display: flex;
    align-items: center;

    .fold-expand {
      display: flex;
      cursor: pointer;
    }

    .breadcrumb {
      margin-left: 20px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .icon-area {
      margin-right: 20px;
    }

    .icon-area > .el-icon {
      cursor: pointer;
      margin: 0 10px;
    }

    .avator-box {
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
