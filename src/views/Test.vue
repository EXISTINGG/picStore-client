<template>
  <div class="user-body">
    <header class="header">
      <div class="goback" @click="router.back()">
        <el-icon><ArrowLeftBold /></el-icon>返回
      </div>
      <h2>个人中心</h2>
    </header>

    <main class="main">
      <div class="left-menu">
        <i @click="changeIdx(0)">个人信息</i>
        <i @click="changeIdx(1)">修改密码</i>
      </div>

      <div class="right-content">
        <div class="user-info" v-show="showIdx === 0">
          <el-form
            label-width="100px"
            :model="formLabelAlign"
            :rules="rules"
            style="max-width: 400px"
          >
            <el-form-item label="ID：">{{userinfo.id}}</el-form-item>
            <el-form-item label="注册时间：">{{formatTimestamp(userinfo.regdate)}}</el-form-item>
            <el-form-item label="邮箱：">{{userinfo.email}}</el-form-item>
            <el-form-item prop="name" label="用户名：">
              <el-input v-model.trim="formLabelAlign.name" maxlength="7" class="name-input"/>
            </el-form-item>
          </el-form>

          <el-button type="primary" plain class="btn-submit" @click="summitUserInfo">保存</el-button>
        </div>

        <div class="update-pwd" v-show="showIdx === 1">

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {useRouter} from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import {useUserStore} from '@/store/user'
import {useLoginStore} from '@/store/login'
import {success,warning,error} from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'
import {formatTimestamp} from '@/utils/formatTimestamp'

const router = useRouter()
const userStore = useUserStore()
const loginStore = useLoginStore()

// 展示内容
const showIdx = ref(0)
// 改变展示内容
const changeIdx = i => showIdx.value = i
// 信息
const userinfo = ref(getItem('user'))

const formLabelAlign = reactive({
  name: loginStore.user.username,
})

const rules = reactive({
  name: [
    { required: false, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 7, message: '长度应该在1~7个字符之间', trigger: 'blur' },
  ],
})

// 提交修改信息
const summitUserInfo = () => {
  if(formLabelAlign.name === '') return warning('用户名不能为空')
  userStore.updateInfoFun(formLabelAlign.name)
}
</script>

<style lang="scss" scoped>
.user-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  background: url('../assets/bg/bg-4.jpg') no-repeat center/cover;
  height: 100vh;
}

.header,
.left-menu,
.right-content {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: saturate(100%) blur(20px);
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 0 20px;
  width: 80%;
  height: 60px;

  .goback {
    display: flex;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
  }

  h2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

.main {
  display: flex;
  justify-content: space-evenly;
  width: 80%;

  .left-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    height: 400px;

    i {
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
    }

    i:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  .right-content {
    width: 60%;
    padding: 20px;

    .user-info {
      :deep(.el-input__wrapper) {
        background: none;
      }

      .btn-submit {
        float: right;
      }
      
    }
  }
}
</style>
