<template>
  <el-scrollbar
    :max-height="homeStore.folderHeight - homeStore.homeH + homeStore.h1H"
  >
    <div class="img-bigbox" v-infinite-scroll="getMore" infinite-scroll-delay="500" infinite-scroll-distance="100" infinite-scroll-immediate>
      <div class="img-box" v-for="(item, i) in homeStore.imgList">
        <el-image
          class="img"
          :src="item.url"
          :key="item.url"
          fit="cover"
          :title="item.imgName"
          lazy
          :preview-src-list="homeStore.imgPreviewList"
          preview-teleported
          :initial-index="imgIndex"
          :infinite="false"
          @click="previewImg(i)"
        />
        <span class="text-box">
          <h6>{{ item.imgName }}</h6>
          <el-popover placement="right" :width="150" trigger="click" :disabled="popoverDisabled">
          <!-- <el-icon><Menu /></el-icon> -->
          <template #reference>
            <el-icon class="more" @click="currentImg = item.imgName"><Menu /></el-icon>
          </template>
          <!-- 对图片的操作 -->
          <!-- <div class="operate-img" style="display: flex; flex-direction: column; align-items: center;"> -->
          <div class="operate-img">
            <span @click="copyImgUrl(item.url)"><el-icon><Link /></el-icon>&nbsp; 复制链接</span>
            <span @click="renameleteImgDialog"><el-icon><Edit /></el-icon>&nbsp; 重命名图片</span>
            <span @click="openDeleteImgDialog"><el-icon><Delete /></el-icon>&nbsp; 删除图片</span>
          </div>
          </el-popover>
          <!-- <i class="copy" @click="copyImgUrl(item.url)">复制</i> -->
        </span>
      </div>
    </div>
  </el-scrollbar>

  <!-- 删除图片 -->
 <el-dialog v-model="deleteImgDialogVisible" title="你正在删除图片" width="30%" align-center>
    <span>
      你确认要删除 {{currentImg}} 吗？
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteImgDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteImg">
          删除
        </el-button>
      </span>
    </template>
  </el-dialog>

<!-- 重命名图片 -->
  <el-dialog v-model="renameImgDialogVisible" width="30%" :title="'你正在重命名 '+ currentImg" align-center>
    <el-form>
      <el-form-item label="新的图片名" label-width="100px">
        <el-input v-model.trim="newImgName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameImgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="renameImg">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Menu ,Link,Edit, Delete} from '@element-plus/icons-vue'
import { useHomeStore } from '@/store/home'
import { useImgStore } from '@/store/image'
import {success,warning,error} from '@/utils/message'


const homeStore = useHomeStore()
const imgStore = useImgStore()
// 图片索引
const imgIndex = ref(0)
// 现操作的图片
const currentImg = ref('')
// 对图片的操作 是否可用
const popoverDisabled = ref(false)
// 删除图片询问框
const deleteImgDialogVisible = ref(false)
// 打开删除图片询问框
const openDeleteImgDialog = () => {
  deleteImgDialogVisible.value= true
  popoverDisabledFun()
}
// 重命名图片询问框
const renameImgDialogVisible = ref(false)
// 打开重命名图片询问框
const renameleteImgDialog = () => {
  renameImgDialogVisible.value = true
  newImgName.value = ''
  popoverDisabledFun()
}
// 新的图片名
const newImgName = ref('')

// 获取更多图片
const getMore = () => {
  console.log('more')
  homeStore.getImgList(homeStore.currentFolder, 20)
}
// 预览图片
const previewImg = (i) => (imgIndex.value = i)

let timer
// 隐藏对图片的操作(关闭功能后立马启用,为了隐藏Popover)
const popoverDisabledFun = () => {
  clearTimeout(timer)
  popoverDisabled.value = true
    timer = setTimeout(() => {
      popoverDisabled.value = false
    }, 500)
}

// 复制图片链接
const copyImgUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    success('复制成功')
    popoverDisabledFun()
  } catch (err) {
    error('复制失败')
    popoverDisabledFun()
  }
}
// 删除图片
const deleteImg = () => {
  imgStore.deleteImgFun(homeStore.currentFolder,currentImg.value).then(() => {
    if(imgStore.isDelete) {
      // 关闭
      deleteImgDialogVisible.value= false
      // 清空
      homeStore.imgList = []
      // 刷新
      homeStore.getImgList(homeStore.currentFolder, 40, true)
      // 重置数据
      imgStore.isDelete = false
    }
  })
}
// 重命名图片
const renameImg = () => {
  console.log(currentImg.value,newImgName.value,homeStore.currentFolder);
  if(newImgName.value === '') return warning('请输入有效字符')
  imgStore.renameImgFun(homeStore.currentFolder,currentImg.value,newImgName.value).then(() => {
    if(imgStore.isRename) {
      // 关闭
      renameImgDialogVisible.value= false
      // 清空
      homeStore.imgList = []
      // 刷新
      homeStore.getImgList(homeStore.currentFolder, 40, true)
      // 重置数据
      imgStore.isRename = false
    }
  })
}
</script>

<style lang="scss" scoped>
$main-bg: #409eff;

.img-bigbox {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 150px;
  // height: 130px;
  column-count: 5;
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
      flex: .8;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .more {
      flex: 0.2;
      color: $main-bg;
      font-size: 16px;
      text-align: right;
      cursor: pointer;
    }
  }
}

.operate-img {
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 100%;

      span {
        display: flex;
        justify-content: start;
        align-items:center;
        padding: 5px;
        cursor: pointer;
        width: 100%;
      }

      span:hover {
        background: $main-bg;
        color: #000;
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
