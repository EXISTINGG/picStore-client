<template>
  <div class="upload-body">
    <div class="upload-area">
      <el-upload
        class="upload-demo"
        drag
        action=""
        multiple
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="httpRequest"
        accept="image/*"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽至此处或 <em>点击上传</em>
          <p>单图不要超过2MB</p>
        </div>
      </el-upload>

      <div class="folder-message">
        <div  class="folder">
          <h3>选择目录:</h3>
          <el-select v-model="selectFolder" placeholder="目录">
          <el-option
            v-for="item in homeStore.folderList"
            :key="item"
            :value="item"
          />
        </el-select>
        </div>

        <el-carousel height="60px" direction="vertical" class="carousel">
          <el-carousel-item v-for="item in tip" :key="item" class="carousel-item">
            <h3>{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <UpLoadList :uploadList="uploadImgList" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { getItem } from '@/utils/localStorage'
import { useHomeStore } from '@/store/home'
import { success, warning, error } from '@/utils/message'
import UpLoadList from './components/UpLoadList.vue'

const homeStore = useHomeStore()

// 选择的目录
const selectFolder = ref(homeStore.firstFolder)
// 提示的消息
const tip = ref(['上传之前先选择目录','没有目录?请刷新!','如果检测未通过,请前往图片检测自行检测'])
// 上传的图片
const uploadImgList = ref([])

// 增加或替换值
const changUpLoadImgList = (file, fileitem, value) => {
  uploadImgList.value.map((item) => {
    if (item.uid === file.uid) {
      item[fileitem] = value
    }
  })
}

// 定时器(同时上传多张图片,防止消息过多)
const timer = ref(null)
// 上传之前
const beforeUpload = async (file) => {
  // 先清除之前的定时器
  if (timer.value) {
    clearTimeout(timer.value)
  }

  if (selectFolder.value === '') {
    timer.value = setTimeout(() => {
      warning('请选择目录')
    }, 500)
    return false
  }

  if (!/^image\//.test(file.type)) {
    warning('只允许上传图片文件')
    return false
  } else if (file.size / 1024 / 1024 > 2) {
    warning('文件超过2MB')
    return false
  }

  // 创建Blob对象
  const blob = new Blob([file], { type: 'text/plain' })
  // 将创建的Blob对象绑定到一个临时URL上(缩略图url)
  const blobUrl = URL.createObjectURL(blob)

  // 释放临时URL所占用的资源
  // URL.revokeObjectURL(blobUrl);

  // 在 beforeUpload 中初始化进度数据
  const newUpload = {
    blobUrl,
    uid: file.uid,
    name: file.name,
    checkProgress: 0,
    uploadProgress: 0,
    imgUrl: ''
  }

  uploadImgList.value.push(newUpload)

  const formData = new FormData()
  formData.append('image', file)

  // 设置新的定时器，在一定延迟之后触发警告消息
  timer.value = setTimeout(() => {
    warning('正在检测图片,请稍等')
  }, 500)

  const { data } = await axios.post(
    'https://nsfwapi.hxq-001.top/nsfw',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // 上传进度数值1-100(已上传/总量). | 0(清除小数部分). 10(将浮点数百分比转换为整数百分比)
      onUploadProgress: (progressEvent) => {
        const complete = parseInt(
          ((progressEvent.loaded / progressEvent.total) * 100) | 0,
          10
        )
        // console.log(progressEvent.loaded, progressEvent.total, complete)

        changUpLoadImgList(file, 'checkProgress', complete)
      }
    }
  )

  if (data.status !== 200) {
    warning('图片检测出错')
    changUpLoadImgList(file, 'checkImg', 'exception')
    // 不允许上传
    return false
  }

  if (!data.result.isHealthy) {
    error('图片检测未通过')
    changUpLoadImgList(file, 'checkImg', 'warning')
    return false
  } else {
    success('检测通过,正在上传')
    changUpLoadImgList(file, 'checkImg', 'success')
    // 允许上传
    return true
  }
}

const httpRequest = async (http) => {
  const { file } = http

  const formData = new FormData()
  // 编码上传文件名,防止中文乱码(后端解码返回)
  const filename = encodeURIComponent(file.name)
  formData.append('file', file, filename)
  formData.append('folder', selectFolder.value)

  const { data } = await axios.post(
    'https://picapi.hxq-001.top/file/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data;  charset=utf-8',
        Authorization: getItem('TOKEN')
      },
      onUploadProgress: (progressEvent) => {
        const complete = parseInt(
          ((progressEvent.loaded / progressEvent.total) * 100) | 0,
          10
        )
        
        changUpLoadImgList(file, 'uploadProgress', complete)
      }
    }
  )

  if (data.status !== 200) {
    changUpLoadImgList(file, 'upLoadImg', 'exception')
    return warning(data.message || '文件上传出错')
  }

  success(data.data.message || '文件上传成功')
  changUpLoadImgList(file, 'upLoadImg', 'success')

  changUpLoadImgList(file, 'imgUrl', data.data.url)
}

onMounted(() => {
  homeStore.getFolderList()
})
</script>

<style lang="scss" scoped>
.upload-body {
  width: 80%;
  margin: 0 auto;
}

.folder-message {
  display: flex;
  justify-content:space-between;
  width: 100%;
  border: .5px solid skyblue;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  border-radius: 5px;

  .folder {
    width: 30%;
    
    .el-select__popper .el-popper {
      // max-width: 30px;
    }
  }

  .carousel {
    width: 60%;
   
   .carousel-item {
     display: flex;
     align-items: center
   }
  }
}
</style>
