<template>
  <el-button
    size="lager"
    type="danger"
    @click="deletesignOutUser"
    >删除所有用户</el-button
  >
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="用户名" prop="username" />
    <el-table-column label="邮箱" prop="email" />
    <el-table-column label="注册日期">
      <template #default="scope">
        {{ formatTimestamp(scope.row.regdate) }}
      </template>
    </el-table-column>
    <el-table-column label="角色" width="180">
      <template #default="scope">
        <el-tag v-show="scope.row.power == 1">超级管理员</el-tag>
        <el-tag type="success" v-show="scope.row.power == 2">管理员</el-tag>
        <el-tag type="warning" v-show="scope.row.power == 3">普通用户</el-tag>
        <el-tag type="info" v-show="scope.row.power == 4">禁用功能</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="180">
      <template #default="scope">
        <el-tag type="info" v-show="scope.row.status == 0">已注销</el-tag>
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
          @click="restorThisUser(scope.$index, scope.row)"
          >恢复</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="delThisUser(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/store/admin'
import { formatTimestamp } from '@/utils/formatTimestamp'

const adminStore = useAdminStore()

// 搜索关键词
const search = ref('')

// 表格展示的数据,搜索后的数据
const filterTableData = computed(() =>
  adminStore.outUserList.filter(
    (data) =>
      !search.value ||
      data.username.includes(search.value) ||
      data.email.includes(search.value)
  )
)

// 恢复某个注销的用户
const restorThisUser = (index, row) => {
  adminStore.restoreUserFun(row).then(() => {
    if (adminStore.isResoterSuccess) {
      adminStore.getsignOutUserListFun()
    }
  })
}
// 删除某个注销的用户
const delThisUser = (index, row) => {
  adminStore.delUserFun(row).then(() => {
    if (adminStore.isDelSuccess) {
      adminStore.getsignOutUserListFun()
    }
  })
}

// 删除注销用户
const deletesignOutUser = () => {
  if(adminStore.outUserList.length === 0) return
  adminStore.deletesignOutUserFun().then(() => {
    if (adminStore.isDelSuccess) {
      adminStore.getsignOutUserListFun()
    }
  })
}

// 获取注销user列表
onMounted(() => {
  adminStore.getsignOutUserListFun()
})
</script>
