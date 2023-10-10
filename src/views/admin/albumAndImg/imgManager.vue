<template>
  <el-scrollbar height="84vh">
  <el-table :data="filterTableData" :infinite-scroll-disabled="adminStore.disabledMore" :infinite-scroll-immediate="false" v-infinite-scroll="getMoreThrottled" :infinite-scroll-distance="100" :infinite-scroll-delay="500" >
    <el-table-column label="ID" width="100" prop="id" />
    <el-table-column label="图片">
      <template #default="scope">
        <el-image :src="scope.row.file_url" preview-teleported :z-index="9999999" :preview-src-list="[scope.row.file_url]"  lazy></el-image>
      </template>
    </el-table-column>
    <el-table-column label="图片名" width="120">
      <template #default="scope">
          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ scope.row.name }}</div>
      </template>
    </el-table-column>
    <el-table-column label="上传者" prop="uploader" />
    <el-table-column label="上传日期" width="200">
      <template #default="scope">
        <div>{{formatTimestamp(scope.row.upload_date)}}</div>
      </template>
    </el-table-column>
    <el-table-column label="图片大小">
      <template #default="scope">
        <div>{{convertFileSize(scope.row.file_size)}}</div>
      </template>
    </el-table-column>
    <el-table-column label="所属相册" prop="album_name"/>
    <el-table-column label="隐私性">
      <template #default="scope">
        <el-tag type="success" v-show="scope.row.privacy == 0">公共</el-tag>
        <el-tag v-show="scope.row.privacy == 1">私人</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="存储类型">
      <template #default="scope">
        <el-tag type="success" v-show="scope.row.storage_location == 0">服务器</el-tag>
        <el-tag v-show="scope.row.storage_location == 1">云存储</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索" />
      </template>
      <template #default="scope">
        <el-popconfirm 
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="删除图片"
          @confirm="deleteImg(scope.row.id, scope.row.name)"
          >
          <template #reference>
            <el-button
              size="small"
              type="danger"
              >
              删除
            </el-button>
          </template>
      </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</el-scrollbar>
</template>


<script setup>
import {ref,computed, onMounted} from 'vue'
import { useAdminStore } from '@/store/admin'
import {useImgStore} from '@/store/image'
import {convertFileSize} from '@/utils/convert'
import {formatTimestamp} from '@/utils/formatTimestamp';


const adminStore = useAdminStore()
const imgStore = useImgStore()

// 搜索关键词
const search = ref('')

// 表格展示的数据,搜索后的数据
const filterTableData = computed(() =>
  adminStore.allImgList.filter(
    (data) =>
      !search.value ||
      data.name.includes(search.value) || data.uploader.includes(search.value) || data.privacy.includes(search.value) || data.storage_location.includes(search.value)
  )
)


// 获取更多
// const getMore = () => {
//   console.log('more');
//   adminStore.getAllImgFun(adminStore.offset)
// }

let throttleTimeout;
const throttleDelay = 1000; // 1秒
const getMoreThrottled = () => {
  if (adminStore.loading) {
    // 数据加载中，不触发加载更多
    return;
  }

  // 如果已经设置了节流定时器，则清除它
  if (throttleTimeout) {
    clearTimeout(throttleTimeout);
  }

  // 设置一个新的节流定时器
  throttleTimeout = setTimeout(() => {
    console.log('more');
    adminStore.loading = true; // 数据加载中
    adminStore.getAllImgFun(adminStore.offset).then(() => {
      adminStore.loading = false;
    });
  }, throttleDelay);
};

const deleteImg = async (id,name) => {
  await imgStore.deleteImgFun(id, name);
  if(imgStore.isDelete) {
    adminStore.getAllImgFun(0,adminStore.allImgList.length)
  }
}

onMounted(() => {
  adminStore.getAllImgFun(0)
})
</script>