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
        <i @click="changeIdx(2)" :class="showIdx === 2 ? 'nobg' : ''"
          >更换邮箱</i
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
              formatTimestamp(userinfo.registration_time)
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

        <div class="update-email" v-show="showIdx === 2">

          <el-steps :active="active" class="steps-area" align-center finish-status="success">
            <el-step title="验证身份" />
            <el-step title="更换邮箱" />
            <el-step title="更换成功" />
          </el-steps>
          <!-- 步骤一 -->
          <div v-show="active === 0">
              <el-form
              :model="emailFrom"
              :rules="rules"
              style="max-width: 400px"
              label-width="100px"
              class="demo-ruleForm-changemail"
            >
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model.trim="emailFrom.email"
                  type="email"
                  :prefix-icon="Message"
                  placeholder="请输入新的邮箱"
                />
              </el-form-item>
              <el-form-item label="密码" prop="passwordEmail">
                <el-input
                  v-model.trim="emailFrom.passwordEmail"
                  type="password"
                  show-password
                  :prefix-icon="Lock"
                  maxlength="12"
                  autocomplete="off"
                  placeholder="输入密码以验证身份"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="changeEmailCode"
                  >{{ getCodeBtn ? `${waitTime}` : '获取验证码' }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 步骤二 -->
          <div v-show="active === 1">
              <el-form
              ref="codeEmailFromRef"
              :model="codeEmailForm"
              :rules="rules"
              style="max-width: 400px"
              label-width="100px"
              class="demo-ruleForm-changemail"
            >
              <el-form-item label="验证码" prop="code">
                <el-input
                  v-model.trim="codeEmailForm.code"
                  type="text"
                  :prefix-icon="Key"
                  maxlength="6"
                  placeholder="请输入验证码"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitCodeEmailForm(codeEmailFromRef)"
                  >提交验证码</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 步骤三内容 -->
          <div v-show="active === 3">
            <el-result
              icon="success"
              title="更换邮箱成功"
              :sub-title="`${waitThreeTime}秒返回登录页`"
            >
          </el-result>
          </div>

          <div class="bottom-btn" style="margin-top: 12px">
            <el-button v-show="active < 2 && active > 0"  @click="last">上一步</el-button>
            <el-button v-show="active < 3" :disabled="nextDisabled" @click="next">下一步</el-button>
          </div>
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
import { reactive, ref ,watch} from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useLoginStore } from '@/store/login'
import { Lock ,Message,Key} from '@element-plus/icons-vue'
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
// 禁用获取验证码按钮
const getCodeBtn = ref(false)
// 下一步按钮禁用
const nextDisabled = ref(true)
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
// 更改邮箱表单数据
const emailFrom = reactive({
  email: '',
  passwordEmail: ''
})
// 验证码及邮箱表单
const codeEmailFromRef = ref(null)
// 验证码及邮箱表单数据
const codeEmailForm = reactive({
  code: '',
})

// 步骤展示内容
const active = ref(0)

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
  email: [
    {required: true, message: '请输入新的邮箱', trigger: 'blur'},
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    { min: 6, max: 6, message: '长度应该为6个字符', trigger: 'blur' },
  ],
  passwordEmail: [
    { required: true, message: '请输入你的密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度应该在6~12个字符之间', trigger: 'blur' }
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

// 等待时间
const waitTime = ref(60)
// 定义定时器
let intervalId
let timerId
// 获取验证码
const changeEmailCode = () => {
  if(emailFrom.email === '') return warning('请输入邮箱')
  if(emailFrom.passwordEmail === '') return warning('请输入密码')

  // 获取当前时间戳，单位为秒
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // 从LocalStorage中获取上次获取验证码的时间戳
  const changeEmailGetCodeTime = getItem('changeEmailGetCodeTime');

  // 清除上次的定时器
  clearInterval(intervalId);
  clearTimeout(timerId);

  // 禁用按钮
  getCodeBtn.value = true;

  // 如果有上次获取验证码的时间戳，则等待时间等于60 - (现在的时间戳 - 上次的时间戳)
  if(changeEmailGetCodeTime) {
    // 如果没有清除上次的定时器，waitTime小于0，则waitTime等于60,否则就是剩余的时间
    waitTime.value = 60 - (currentTimestamp - changeEmailGetCodeTime) <= 0 ? 60 : 60 - (currentTimestamp - changeEmailGetCodeTime)
  }

  // waitTime每秒减一
    intervalId = setInterval(() => {
      waitTime.value--
    }, 1000);

  timerId = setTimeout(() => {
    // 在等待时间后启用按钮
    getCodeBtn.value = false;

    if(waitTime.value <= 0) {
      // 如果waitTime小于0，清除定时器
      clearInterval(intervalId);
      clearTimeout(timerId);
      // 移除上次的时间戳，以防waitTime为负数，导致点击后立即启用按钮
      removeItem('changeEmailGetCodeTime')
      // waitTime恢复到60
      waitTime.value = 60
    }
  }, waitTime.value * 1000);


  // 如果上次时间戳存在且时间差小于等于 60 秒，则返回警告信息并结束函数
  if (changeEmailGetCodeTime && currentTimestamp - changeEmailGetCodeTime <= 60) {
    return warning(`请等待${waitTime.value}秒后再获取验证码`);
  }

  // 将当前时间戳保存到LocalStorage
  setItem('changeEmailGetCodeTime', currentTimestamp);
  // 获取验证码
  userStore.getChangeEmailCodeFun(emailFrom);
};

const last = () => {
  nextDisabled.value = false
  if (active.value-- < 1) active.value = 0
}

const next = () => {
  nextDisabled.value = true
  if (active.value++ > 2) active.value = 0
}

// 倒计时3秒
const waitThreeTime = ref(3);
let waitThreeTimer;
const submitCodeEmailForm = async (formEl) => {
  if (!formEl) return ;
  await formEl.validate((valid, fields) => {
    // 校验通过
    if (valid) {
      userStore.changeEmailFun(emailFrom, codeEmailForm.code ).then(() => {
        // 
        if(userStore.isChangeEmail) {

          active.value = 3
          // 清空信息
          formEl.resetFields()
          // 3秒后,返回登录页
          waitThreeTimer = setInterval(() => {
            waitThreeTime.value--
            console.log(111111);
            if (waitThreeTime.value <= 0) {
                // 移除用户信息
                loginStore.logOutFun()
                // 返回登录页
                router.replace('/login')
                // 清除定时器
                clearInterval(waitThreeTimer)
              }
          }, 1000);
        }
      })
    } else {
      warning('请输入相关信息')
    }
  })
}

// 监听active变化
watch(active, (newVal, oldVal) => {
  // 略过2,直接成功(0为获取验证码, 1为提交验证码)
  if (newVal === 2) active.value = 3;
  // 1时,禁止下一步
  if (active.value === 1) nextDisabled.value = true; 
})
// 监听邮箱是否为空
watch(emailFrom, (newVal, oldVal) => {
  if (active.value === 0 && newVal.email && newVal.passwordEmail) nextDisabled.value = false;
})
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
  backdrop-filter: saturate(100%) blur(3px);
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
    position: relative;
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

    .update-email {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      .steps-area {
        width: 70%;
      }
    }

    .demo-ruleForm-changemail {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 50%;
      margin-top: 50px;
    }
  }
}

@media (max-width: 768px) {
  .main {
    width: 100%;
  }

  .right-content {
    justify-content: center;
    .demo-ruleForm-changemail {
      margin-right: 20px;
    }

    .update-email {

      .steps-area {
       width: 90% !important;
      }
    }
   
  }

}
</style>
