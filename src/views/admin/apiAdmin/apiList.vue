<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="API" prop="name" />
    <el-table-column label="作用" prop="description" />
    <el-table-column label="所需权限" width="180">
      <template #default="scope">
          <el-select v-model="scope.row.required_permissions"  placeholder="Select">
            <el-option
              v-for="item in 3"
              :key="item"
              :value="item"
            />
          </el-select>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" placeholder="搜索" />
      </template>
      <template #default="scope">
        <el-button
          size="small"
          type="primary"
          @click="changeApi(scope.$index, scope.row)"
          >确定</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/store/admin'

const adminStore = useAdminStore()

// 搜索关键词
const search = ref('')

// 表格展示的数据,搜索后的数据
const filterTableData = computed(() =>
  adminStore.apiList.filter(
    (data) =>
      !search.value ||
      data.name.includes(search.value) || data.description.includes(search.value)
  )
)

// 确认修改权限
const changeApi = (index, row) => {
  adminStore.changeApiFun(row)
}

// 获取api列表
onMounted(() => {
  adminStore.getApiListFun()
})
</script>
