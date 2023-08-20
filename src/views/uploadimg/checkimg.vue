<template>
  <div class="upload-body">
    <div class="upload-area">
      <el-upload
        class="upload-demo"
        drag
        action=""
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
    </div>

    <CheckImgInfo :checkImg="uploadImgObj" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onBeforeUnmount } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { success, warning, error } from '@/utils/message'
import CheckImgInfo from './components/CheckImgInfo.vue'

// 上传的图片
const uploadImgObj = ref({})

// 创建一个取消令牌
let source = axios.CancelToken.source()
// 加载状态
let isLoading = false

// 定时器(同时上传多张图片,防止消息过多)
const timer = ref(null)
// 上传
const beforeUpload = async (file) => {
  if (!/^image\//.test(file.type)) {
    warning('只允许上传图片文件')
    return false
  } else if (file.size / 1024 / 1024 > 2) {
    warning('文件超过2MB')
    return false
  }

  uploadImgObj.value = {}

  // 创建Blob对象
  const blob = new Blob([file], { type: 'text/plain' })
  // 将创建的Blob对象绑定到一个临时URL上(缩略图url)
  const blobUrl = URL.createObjectURL(blob)

  // 在 beforeUpload 中初始化进度数据
  const newUpload = {
    blobUrl,
    uid: file.uid,
    name: file.name,
    checkProgress: 0
  }

  uploadImgObj.value = newUpload

  return true
}

const httpRequest = async (http) => {
  /**
   * 是否有正在加载的图片
   * 不使用uploadImgObj的加载状态,因为它是每个图片的状态，而不是本页面的加载状态
   */
  if (isLoading) {
    // 取消上一次请求
    source.cancel('Operation canceled by the user.')
    // 重新创建一个取消令牌，否则取消后不再上传
    source = axios.CancelToken.source()
  }

  // 正在加载
  isLoading = true
  // 该图片的加载状态
  uploadImgObj.value.isLoading = true

  // 先清除之前的定时器
  if (timer.value) {
    clearTimeout(timer.value)
  }

  // 设置新的定时器，在一定延迟之后触发警告消息
  timer.value = setTimeout(() => {
    warning('正在检测图片,请稍等')
  }, 500)

  const { file } = http

  const formData = new FormData()
  formData.append('image', file)

  try {
    const { data } = await axios.post(
      'https://nsfwapi.hxq-001.top/nsfw',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // 取消令牌
        cancelToken: source.token,
        // 上传进度数值1-100(已上传/总量). | 0(清除小数部分). 10(将浮点数百分比转换为整数百分比)
        onUploadProgress: (progressEvent) => {
          const complete = parseInt(
            ((progressEvent.loaded / progressEvent.total) * 100) | 0,
            10
          )
          uploadImgObj.value.checkProgress = complete
        }
      }
    )

    // 加载完成
    isLoading = false
    // 该图片的加载状态： false
    uploadImgObj.value.isLoading = false

    console.log(data)

    if (data.status !== 200) {
      uploadImgObj.value.checkImg = 'exception'
      // 不允许上传
      return error('图片检测出错')
    }

    if (!data.result.isHealthy) {
      error('图片检测未通过')
      uploadImgObj.value.checkImg = 'warning'
    } else {
      success('检测通过')
      uploadImgObj.value.checkImg = 'success'
    }
    uploadImgObj.value.statusCode = data.status
    uploadImgObj.value.isHealthy = data.result.isHealthy
    uploadImgObj.value.predictions = data.result.predictions
  } catch (error) {
    console.log(error)
  }
}

onBeforeUnmount(() => {
  if (uploadImgObj.value.blobUrl) {
    URL.revokeObjectURL(uploadImgObj.value.blobUrl)
  }
})
</script>

<style lang="scss" scoped>
.upload-body {
  width: 80%;
  margin: 0 auto;
}
</style>
