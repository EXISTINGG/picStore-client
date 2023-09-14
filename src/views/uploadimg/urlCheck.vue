<template>
  <div class="urlupload-body">
    <div class="upload-folder-url">
      <el-input
        v-model.trim="imgUrl"
        :autosize="{ minRows: 5, maxRows: 10 }"
        type="textarea"
        placeholder="请输入链接,确保只有一个链接"
      />

      <div class="btn-area">
        <el-button type="primary" round @click="clearUrl">清空链接</el-button>
        <el-button type="primary" round @click="submitUrl">提交</el-button>
      </div>
    </div>

    <CheckImgInfo :checkImg="uploadImgObj" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { success, warning, error } from '@/utils/message'
import CheckImgInfo from './components/CheckImgInfo.vue'

// 上传的图片链接
const imgUrl = ref('')
// 链接对象
const uploadImgObj = ref({})

// 清空链接
const clearUrl = () => (imgUrl.value = '')

// 创建一个取消令牌
let source = axios.CancelToken.source()
// 加载状态
let isLoading = false

// 定时器(同时上传多张图片,防止消息过多)
const timer = ref(null)
// 提交链接
const submitUrl = async () => {
  if (imgUrl.value === '') return warning('请输入链接')

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

  
  // uploadImgObj.value = {}
  


  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000) // 生成随机数

  const urlObj = {
    uid: `${timestamp}-${random}`,
    name: imgUrl.value,
    checkProgress: 0,
    imgUrl: ''
  }

  uploadImgObj.value = urlObj

  // 先清除之前的定时器
  if (timer.value) {
    clearTimeout(timer.value)
  }

  // 开始检测
  timer.value = setTimeout(() => {
    warning('正在检测图片,请稍等')
  }, 500)

  try {
    // 正在加载
    isLoading = true
    // 该图片的加载状态
    uploadImgObj.value.isLoading = true
    //
    const { data } = await axios.post(
      `https://nsfwapi.hxq-001.top/nsfw-link`,
      { image_url: uploadImgObj.value.name },
      {
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

    //
    if (data.status !== 200) {
      uploadImgObj.value.checkImg = 'exception'
      return error('图片检测出错')
    }

    if (!data.result.isHealthy) {
      uploadImgObj.value.checkImg = 'warning'
      error('图片检测未通过')
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
</script>

<style lang="scss" scoped>
.urlupload-body {
  margin: 10px auto;
  width: 80%;
}

.btn-area {
  display: flex;
  justify-content: end;
  align-items: center;
  margin: 10px 0;
}
</style>
