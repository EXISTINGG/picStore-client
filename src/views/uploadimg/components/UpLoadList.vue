<template>
  <el-scrollbar :max-height="calculateMaxHeight()" class="upload-itemlist">
    <div class="imgitem-box" v-for="i in uploadList" :key="i.uid">
      <div class="left-img-info">
        <el-image :src="i.blobUrl || i.name" fit="contain" class="thumbnail-img">
        </el-image>
        <div class="img-info">
          <p>{{ i.name }}</p>
          <!-- 检测进度条 -->
          <el-progress :percentage="i.checkProgress" :status="i.checkImg" />
          <!-- 上传进度条 -->
          <el-progress :percentage="i.uploadProgress" :status="i.upLoadImg" />
          <!-- 链接 -->
          <p>链接：{{ i.imgUrl }}</p>
        </div>
      </div>
      <div class="right-img-operate">
        <el-icon @click="removeImg(i)" title="移除图片,但不会影响上传" class="operate-icon"><Close /></el-icon>
        <el-icon @click="copyImgUrl(i.imgUrl)" title="复制链接" class="operate-icon"><CopyDocument /></el-icon>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
// import axios from 'axios'
import { ref,onBeforeUnmount } from 'vue'
import { Close, CopyDocument } from '@element-plus/icons-vue'
import { success, warning, error } from '@/utils/message'

// 接收父组件的数据
const props = defineProps({
  uploadList: {
    type: Array,
    required: true
  }
})

console.log(props);

// 移除图片
const removeImg = (file) => {
  const index = props.uploadList.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    // 释放临时URL所占用的资源
  URL.revokeObjectURL(props.uploadList[index].blobUrl);
    props.uploadList.splice(index, 1);
    }
}

// 复制图片链接
const copyImgUrl = async (url) => {
  if(!url) return
  try {
    await navigator.clipboard.writeText(url)
    success('复制成功')
  } catch (err) {
    error('复制失败')
  }
}

// 在组件销毁之前执行释放操作
onBeforeUnmount(() => {
  props.uploadList.forEach(item => {
    if (item.blobUrl) {
      console.log('清除',item.blobUrl);
      URL.revokeObjectURL(item.blobUrl);
    }
  });
});

// 计算 .upload-itemlist 盒子的最大高度
const calculateMaxHeight = () => {
  const windowHeight = window.innerHeight
  return `${windowHeight * 0.6}px` // 占页面高度
}
</script>

<style lang="scss" scoped>
.upload-itemlist {
  display: flex;
  flex-direction: column;
}

.imgitem-box {
  margin: 10px 20px;
  //
  display: flex;
  justify-content: space-between;
  padding: 10px;
  height: 70px;
  border: 0.5px solid #333;
  border-radius: 5px;
  backdrop-filter: saturate(100%) blur(40px);

  .left-img-info {
    display: flex;
    width: 90%;

    .thumbnail-img {
      height: 100%;
      width: 80px;
    }

    .img-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: 0 10px;
      overflow: hidden;

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
    }
  }

  .right-img-operate {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
    width: 10%;
    font-size: 16px;

    .operate-icon {
      cursor: pointer;
    }
  }
}
</style>
