<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="用户名" prop="username" />
    <el-table-column label="邮箱" prop="email" />
    <el-table-column label="注册日期">
    <template #default="scope">
        {{formatTimestamp(scope.row.regdate)}}
      </template>
    </el-table-column>
    <el-table-column label="角色" width="180">
      <template #default="scope">
        <el-tag  v-show="scope.row.power == 1">超级管理员</el-tag>
        <el-tag  type="success" v-show="scope.row.power == 2">管理员</el-tag>
        <el-tag  type="warning" v-show="scope.row.power == 3">普通用户</el-tag>
        <el-tag  type="info" v-show="scope.row.power == 4">禁用功能</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="权限" width="180">
      <template #default="scope">
        <el-select v-model="scope.row.power" placeholder="Select">
          <el-option v-for="item in 4" :key="item" :value="item" />
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
          @click="changePower(scope.$index, scope.row)"
          >确定</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/store/admin'
import { formatTimestamp } from '@/utils/formatTimestamp'
import {success,warning} from '@/utils/message'



const adminStore = useAdminStore()

// 搜索关键词
const search = ref('')

// 表格展示的数据,搜索后的数据
const filterTableData = computed(() =>
  adminStore.userList.filter(
    (data) =>
      !search.value ||
      data.username.includes(search.value) ||
      data.email.includes(search.value) || data.power.includes(search.value)
  )
)

// 确认修改权限
const changePower = (index, row) => {
  console.log(index, row)
  if(row.power == 1) return warning('不可操作')
  adminStore.changeUserFun(row)
}

// 获取user列表
onMounted(() => {
  adminStore.getUserListFun()
})
</script>
