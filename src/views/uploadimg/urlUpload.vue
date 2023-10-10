<template>
  <div class="urlupload-body">
    <div class="upload-album-url">
      <el-input
        v-model="imgUrl"
        :autosize="{ minRows: 10, maxRows: 15 }"
        type="textarea"
        placeholder="请输入链接,确保一行一个且不超过10个"
      />

      <div class="select-submit">
        <div class="album">
          <h3>选择相册:</h3>
          <el-select v-model="selectAlbum.album" placeholder="相册" @change="changeOption">
          <el-option
            v-for="item in homeStore.albumList"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{ item.privacy == 0 ? '公共' : '私人' }}</span>
          </el-option>
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
import UpLoadList from './components/uploadlist.vue'

const homeStore = useHomeStore()
const imageStore = useImgStore()

// 上传的图片链接
const imgUrl = ref('')
// 链接数组
const imgUrlArr = ref([])
// 选择的相册
const selectAlbum = ref({album: homeStore.firstAlbum, id: homeStore.firstAlbumId})

// 增加或替换值
const changUpLoadImgList = (file, fileitem, value) => {
  imgUrlArr.value.map((item) => {
    if (item.uid === file.uid) {
      item[fileitem] = value
    }
  })
}

// 选择相册
const changeOption = (e) => {
  selectAlbum.value.id = e.id
  selectAlbum.value.album = e.name
}

// 清空链接
const clearUrl = () => imgUrl.value = ''

// 定时器(同时上传多张图片,防止消息过多)
const timer = ref(null)
// 提交链接
const submitUrl = () => {
  if (imgUrl.value === '') return warning('请输入链接')
  if (selectAlbum.value.album === '') return warning('请选择相册')
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

    // console.table({id :selectAlbum.value.id, album_name: selectAlbum.value.album, imgUrl: url});
    // 开始上传
    const { data: uploadRes } = await axios.post(
      'https://picapi.hxq-001.top/image/netimg',
      // 'http://127.0.0.1/image/netimg',
      { id :String(selectAlbum.value.id), album_name: selectAlbum.value.album, imgUrl: url },
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

    changUpLoadImgList(urlObj, 'imgUrl', uploadRes.data.file_url)
  })
}

onMounted(() => {
  homeStore.getAlbumList()
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
