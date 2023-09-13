<template>
  <div class="urlupload-body">
    <div class="upload-folder-url">
      <el-input
        v-model="imgUrl"
        :autosize="{ minRows: 10, maxRows: 15 }"
        type="textarea"
        placeholder="请输入链接,确保一行一个且不超过10个"
      />

      <div class="select-submit">
        <div class="folder">
          <h3>选择目录:</h3>
          <el-select v-model="selectFolder" placeholder="目录">
            <el-option
              v-for="item in homeStore.folderList"
              :key="item"
              :value="item"
            />
          </el-select>
        </div>

        <div class="btn-area">
          <el-button type="primary" round @click="clearUrl">清空链接</el-button>
          <el-button type="primary" round @click="submitUrl">提交</el-button>
        </div>
      </div>
    </div>

    <UpLoadList :uploadList="imgUrlArr" />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useHomeStore } from '@/store/home'
import { useImgStore } from '@/store/image'
import { getItem } from '@/utils/localStorage'
import { success, warning, error } from '@/utils/message'
import UpLoadList from './components/UpLoadList.vue'

const homeStore = useHomeStore()
const imageStore = useImgStore()

// 上传的图片链接
const imgUrl = ref('')
// 链接数组
const imgUrlArr = ref([])
// 选择的目录
const selectFolder = ref(homeStore.firstFolder)

// 增加或替换值
const changUpLoadImgList = (file, fileitem, value) => {
  imgUrlArr.value.map((item) => {
    if (item.uid === file.uid) {
      item[fileitem] = value
    }
  })
}

// 清空链接
const clearUrl = () => imgUrl.value = ''

// 定时器(同时上传多张图片,防止消息过多)
const timer = ref(null)
// 提交链接
const submitUrl = () => {
  if (imgUrl.value === '') return warning('请输入链接')
  if (selectFolder.value === '') return warning('请选择目录')
  // 转换为数组
  const urlList = imgUrl.value.trim().split('\n')
  // 循环数组,添加属性
  urlList.map(async (url, i) => {

    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000000) // 生成随机数

    const urlObj = {
      uid: `${timestamp}-${random}`,
      name: url,
      checkProgress: 0,
      uploadProgress: 0,
      imgUrl: ''
    }

    imgUrlArr.value.push(urlObj)

    // 先清除之前的定时器
    if (timer.value) {
      clearTimeout(timer.value)
    }

    // 开始检测
    timer.value = setTimeout(() => {
      warning('正在检测图片,请稍等')
    }, 500);

    //
    const { data } = await axios.post(
      `https://nsfwapi.hxq-001.top/nsfw-link`,
      { image_url: url },
      {
        // 上传进度数值1-100(已上传/总量). | 0(清除小数部分). 10(将浮点数百分比转换为整数百分比)
        onUploadProgress: (progressEvent) => {
          const complete = parseInt(
            ((progressEvent.loaded / progressEvent.total) * 100) | 0,
            10
          )

          changUpLoadImgList(urlObj, 'checkProgress', complete)
        }
      }
    )
    //
    if (data.status !== 200) {
      changUpLoadImgList(urlObj, 'checkImg', 'exception')
      return warning('图片检测出错')
    }

    if (!data.result.isHealthy) {
      changUpLoadImgList(urlObj, 'checkImg', 'warning')
      return error('图片检测未通过')
    } else {
      success('检测通过,正在上传')
      changUpLoadImgList(urlObj, 'checkImg', 'success')
    }


    // 开始上传
    const { data: uploadRes } = await axios.post(
      'https://picapi.hxq-001.top/file/urlfile',
      { folder: selectFolder.value, fileUrls: [url] },
      {
        headers: {
          Authorization: getItem('TOKEN')
        },
        onUploadProgress: (progressEvent) => {
          const complete = parseInt(
            ((progressEvent.loaded / progressEvent.total) * 100) | 0,
            10
          )

          changUpLoadImgList(urlObj, 'uploadProgress', complete)
        }
      }
    )
    //
    if (uploadRes.status !== 200) {
      changUpLoadImgList(urlObj, 'upLoadImg', 'exception')
      return warning(uploadRes.message || '文件上传出错')
    }

    success(uploadRes.message || '文件上传成功')
    changUpLoadImgList(urlObj, 'upLoadImg', 'success')

    changUpLoadImgList(urlObj, 'imgUrl', uploadRes.url[0])
  })
}

onMounted(() => {
  homeStore.getFolderList()
})
</script>

<style lang="scss" scoped>
.urlupload-body {
  margin: 10px auto;
  width: 80%;
}

.select-submit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;

  .btn-area {
    display: flex;
    align-items: center;
  }
}
</style>
