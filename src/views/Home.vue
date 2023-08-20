<template>
  <!-- 加载动画，解决以服务的方式调用动画不在中心的bug -->
  <!-- <i v-loading.fullscreen.lock="fullscreenLoading"></i> -->
  <div ref="topMenuRef" class="top-menu">
    <TopMenu />
  </div>
  <div class="content-box">
    <div class="left-menu">
      <Folder />
    </div>
    <div
      class="right-imglist"
      v-show="homeStore?.imgList.length != 0"
      :style="{ top: homeStore.topMenuH + 'px' }"
    >
      <ImgList />
    </div>
    <div v-show="homeStore?.imgList.length == 0" class="empty">
      <el-empty description="暂时没有图片" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { ElLoading } from 'element-plus'
import { useHomeStore } from '@/store/home'
import Folder from '@/components/Folder.vue'
import TopMenu from '@/components/TopMenu.vue'
import ImgList from './ImgList.vue'
// import Test from './Test.vue'

const homeStore = useHomeStore()

// const fullscreenLoading = ref(false)
// const openFullScreen1 = () => fullscreenLoading.value = true

const topMenuRef = ref(null)

onMounted(async () => {
  await homeStore.getFolderList()
  console.log(homeStore.firstFolder)
  await homeStore.getImgList(homeStore.firstFolder, 40, true, true)
  homeStore.currentFolder = homeStore.firstFolder
  console.log(333, homeStore.currentFolder)

  homeStore.topMenuH = topMenuRef.value.offsetHeight
})

const imgIndex = ref(0)

const previewImg = (i) => (imgIndex.value = i)
const copyImgUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    ElMessage({
      message: '复制成功',
      type: 'success'
    })
  } catch (err) {
    ElMessage.error('复制失败')
  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.top-menu {
  // display: flex;
  // width: 100%;
}

.content-box {
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;

  .left-menu {
    flex: 0.2;
    // background: red;
  }

  .right-imglist {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    flex: 1;
    height: 100%;
    // column-count: 4;
    // height: 500px;
    // overflow-y: auto;
  }
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

// .img-bigbox {
//   // display: flex;
//   // flex-wrap: wrap;
//   width: 100%;
// }

.img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 150px;
  height: 130px;
  margin: 20px 15px;
  box-sizing: border-box;

  .img {
    width: 100%;
    height: 100px;
  }

  .text-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 10px;

    h6 {
      flex: 0.8;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .copy {
      flex: 0.3;
      color: #409eff;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: 48em) {
  .img-bigbox {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-left: 20%;
  }
  .img-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100px;
    height: 90px;
    margin: 20px 15px;
    box-sizing: border-box;
    // margin: 10px;
  }

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
