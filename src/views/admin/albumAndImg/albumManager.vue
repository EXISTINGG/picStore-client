<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="ID" width="100" prop="id" />
    <el-table-column label="相册名" width="200" prop="name" />
    <el-table-column label="创建者" prop="creator" />
    <el-table-column label="图片数量" prop="file_count" />
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
          title="删除相册同时删除所有图片"
          @confirm="deleteAlbm(scope.row.id, scope.row.name)"
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
</template>


<script setup>
import {ref,computed, onMounted} from 'vue'
import { useAdminStore } from '@/store/admin'
import {useHomeStore} from '@/store/home'

const adminStore = useAdminStore()
const homeStore = useHomeStore()

// 搜索关键词
const search = ref('')

// 表格展示的数据,搜索后的数据
const filterTableData = computed(() =>
  adminStore.allAlbumList.filter(
    (data) =>
      !search.value ||
      data.name.includes(search.value) || data.creator.includes(search.value) || data.privacy.includes(search.value) || data.storage_location.includes(search.value)
  )
)

const deleteAlbm = async (id,name) => {
  await homeStore.deleteAlbumFun(id, name);

  adminStore.getAllAlbumFun()
}

onMounted(() => {
  adminStore.getAllAlbumFun()
})
</script>