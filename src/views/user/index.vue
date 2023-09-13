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
        <i @click="changeIdx(0)" :class="showIdx === 0 ? 'nobg' : ''"
          >个人信息</i
        >
        <i @click="changeIdx(1)" :class="showIdx === 1 ? 'nobg' : ''"
          >修改密码</i
        >
      </div>

      <div class="right-content">
        <div class="user-info" v-show="showIdx === 0">
          <el-form
            label-width="100px"
            :model="formLabelAlign"
            :rules="rules"
            style="max-width: 400px"
          >
            <el-form-item label="ID：">{{ userinfo.id }}</el-form-item>
            <el-form-item label="注册时间：">{{
              formatTimestamp(userinfo.regdate)
            }}</el-form-item>
            <el-form-item label="邮箱：">{{ userinfo.email }}</el-form-item>
            <el-form-item prop="name" label="用户名：">
              <el-input
                v-model.trim="formLabelAlign.name"
                maxlength="7"
                class="name-input"
              />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" plain @click="summitUserInfo"
                >保存</el-button
              >
            </el-form-item>
          </el-form>

          <el-button
            type="danger"
            class="btn-submit"
            @click="delDialogVisible = true"
            >注销账号</el-button
          >
        </div>

        <div class="update-pwd" v-show="showIdx === 1">
          <el-form
            ref="updatePwdFormRef"
            :model="updatePwdForm"
            :rules="rules"
            style="max-width: 400px"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model.trim="updatePwdForm.oldPassword"
                type="password"
                show-password
                maxlength="12"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model.trim="updatePwdForm.password"
                type="password"
                show-password
                maxlength="12"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model.trim="updatePwdForm.confirmPassword"
                type="password"
                show-password
                maxlength="12"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitUpdatePwdForm(updatePwdFormRef)"
                >确认</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
  </div>

  <!-- 注销账号弹窗 -->
  <el-dialog
    v-model="delDialogVisible"
    draggable
    title="您正在注销账号"
    width="30%"
    align-center>
    <span>账号注销后,如需恢复,请联系管理</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteAccount"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useLoginStore } from '@/store/login'
import { success, warning, error } from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'
import { formatTimestamp } from '@/utils/formatTimestamp'

const router = useRouter()
const userStore = useUserStore()
const loginStore = useLoginStore()

// 展示内容
const showIdx = ref(0)
// 改变展示内容
const changeIdx = (i) => (showIdx.value = i)
// 注销弹窗显示
const delDialogVisible = ref(false)
// 信息
const userinfo = ref(getItem('user'))
// 个人信息数据
const formLabelAlign = reactive({
  name: loginStore.user.username
})
// 修改密码表单
const updatePwdFormRef = ref(null)
// 修改密码数据
const updatePwdForm = reactive({
  oldPassword: '',
  password: '',
  confirmPassword: ''
})

// 验证密码是否相同(旧与新)
const validateOldPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value === updatePwdForm.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

// 验证密码是否相同(二次验证新密码)
const validatePwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== updatePwdForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive({
  name: [
    { required: false, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 7, message: '长度应该在1~7个字符之间', trigger: 'blur' }
  ],
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度应该在6~12个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度应该在6~12个字符之间', trigger: 'blur' },
    { validator: validateOldPwd, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度应该在6~12个字符之间', trigger: 'blur' },
    { validator: validatePwd, trigger: 'blur' }
  ]
})

// 提交修改信息
const summitUserInfo = () => {
  if (formLabelAlign.name === '') return warning('用户名不能为空')
  userStore.updateInfoFun(formLabelAlign.name)
}

// 确认密码
const submitUpdatePwdForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 验证通过
    if (valid) {
      userStore.upDatePwdFun(updatePwdForm).then(() => {
        // 修改成功
        if (userStore.isUpdatePwd) {
          success('修改成功,请重新登录账号')
          setTimeout(() => {
            loginStore.logOutFun()
            userStore.isUpdatePwd = false
            router.push('/login')
          }, 3000)
        }
      })
    } else {
      warning('请输入相关信息')
    }
  })
}

// 确认注销账号
const deleteAccount = () => {
  userStore.deleteUserFun().then(() => {
    if (userStore.isdeleteUser) {
      success('注销成功')
      delDialogVisible.value = false
      setTimeout(() => {
        loginStore.logOutFun()
        router.push('/home')
      }, 2000)
    }
  })
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
  background: url('../../assets/bg/gybg-1.jpg') no-repeat center/cover;
  height: 100vh;
}

.header,
.left-menu,
.right-content {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: saturate(100%) blur(10px);
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

    i:hover,
    .nobg {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  .right-content {
    display: flex;
    width: 60%;
    padding: 20px;

    overflow: hidden;

    .user-info {
      :deep(.el-input__wrapper) {
        background: none;
      }

      .btn-submit {
        float: right;
      }
    }

    .demo-ruleForm {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 70%;
    }
  }
}

@media (max-width: 768px) {
  .main {
    width: 100%;
  }

  .right-content {
    justify-content: center;
  }

}
</style>
