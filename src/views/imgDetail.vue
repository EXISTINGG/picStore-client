<template>
    <div class="box"></div>
    <div class="container">
      <header>
        <el-page-header @click="router.back()" class="header">
          <template #title>返回</template>
          <template #content>
            <span> {{strLength(imgDetail.name) ? imgDetail.name.substring(0, 14) + '···' : imgDetail.name}} </span>
          </template>
        </el-page-header>
      </header>
      
      <main>
        <div class="top-img">
          <el-image 
            class="img" 
            :src="imgDetail.file_url" 
            fit="scale-down" 
            :preview-src-list="imgUrl"
            :initial-index="0"
            preview-teleported
          />
        </div>
        <div class="bottom-img-detail">
          <el-descriptions title="详情信息" :column="1" size="large" border>
          <el-descriptions-item width="300" label="图片名">{{strLength(imgDetail.name) ? imgDetail.name.substring(0, 20) + '···' : imgDetail.name}}</el-descriptions-item>
          <el-descriptions-item label="上传者">{{imgDetail.uploader}}</el-descriptions-item>
          <el-descriptions-item label="大小">{{convertFileSize(imgDetail.file_size)}}</el-descriptions-item>
          <el-descriptions-item label="所属相册">{{imgDetail.album_name}}</el-descriptions-item>
          <el-descriptions-item label="图片链接">{{strLength(imgDetail.file_url) ? imgDetail.file_url.substring(0, 20) + '···' : imgDetail.file_url}}</el-descriptions-item>
          <el-descriptions-item label="隐私性">{{imgDetail.privacy == 0 ? '公共' : '私人'}}</el-descriptions-item>
          <el-descriptions-item label="存储类型">{{imgDetail.storage_location == 0 ? '服务器' : '云存储'}}</el-descriptions-item>
          <el-descriptions-item label="上传时间">{{formatTimestamp(imgDetail.upload_date)}}</el-descriptions-item>
        </el-descriptions>
        </div>
      </main>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router';
import { getItem } from '@/utils/localStorage';
import {formatTimestamp} from '@/utils/formatTimestamp';
import {convertFileSize} from '@/utils/convert';
import {strLength} from '@/utils/strLength';

const router = useRouter();
const imgUrl = ref([])

const imgDetail = getItem('imgDetail');
imgUrl.value = [imgDetail.file_url]

</script>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
  // background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
  // background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  // background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-image: linear-gradient(60deg, #abecd6 0%, #fbed96 100%);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  height: 100vh;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  // overflow: hidden;
  
  header {
    display: flex;
    align-items: center;
    padding: 20px;
    width: 100%;
  }

  main {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-around;
    width: 100%;

    .top-img {
      // width: 90%;
      height: 90%;

      .img {
        // width: 100%;
        // height: 100%;
        @extend .top-img;
      }
    }

    .bottom-img-detail {
      margin-left: 20px;
    }
  }
}


@media (max-width: 768px) {
  .container {
    height: 100%;
    overflow: auto;

    header {
      padding: 10px;
    }

    main {
      margin-top: 10px;
      flex-direction: column;

      .top-img {
        margin-bottom: 5px;
      }

      .bottom-img-detail {
        margin-left: 0;
    }
    }
  }
}
</style>