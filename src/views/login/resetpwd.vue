<template>
  <div class="content-box">
    <div class="content">
      <h1>重置密码</h1>

      <main>
        <!-- 步骤条 -->
        <div class="steps-area">
          <el-steps :active="active" align-center finish-status="success">
            <el-step title="输入邮箱" />
            <el-step title="密码重置" />
            <el-step title="重置成功" />
          </el-steps>
        </div>

        <!-- 步骤内容 -->
        <div class="steps-content">
          <!-- 步骤一内容 -->
          <div v-show="active === 0">
            <el-form
              label-position="top"
              label-width="100px"
              :rules="rules"
              :model="emailFrom"
            >
            <el-form-item prop="email" label="注册时的邮箱">
              <el-input v-model.trim="emailFrom.email" :prefix-icon="Message"/>
            </el-form-item>
            <el-button style="margin-top: 12px" type="primary" round :disabled="getCodeBtn" @click="reSetPwdCode">{{ getCodeBtn ? `${waitTime}` : '获取验证码' }}</el-button>
          </el-form>
          </div>

          <!-- 步骤二内容 -->
          <div v-show="active === 1">
            <el-form
              ref="resetPwdFromRef"
              label-position="top"
              label-width="100px"
              :rules="rules"
              :model="resetPwdFrom"
            >
            <el-form-item prop="code" label="验证码">
            <el-input
              type="text"
              :prefix-icon="Key"
              maxlength="6"
              v-model.trim="resetPwdFrom.code"
            />
          </el-form-item>
          <el-form-item prop="password" label="新的密码">
            <el-input
              type="password"
              :prefix-icon="Lock"
              show-password
              maxlength="12"
              v-model.trim="resetPwdFrom.password"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" label="确认密码">
            <el-input
              type="password"
              :prefix-icon="Lock"
              show-password
              maxlength="12"
              v-model.trim="resetPwdFrom.confirmPassword"
            />
          </el-form-item>
            </el-form>
            <el-button type="primary" @click="submitResetPwdFromForm(resetPwdFromRef)">提交信息</el-button>
          </div>

          <!-- 步骤三内容 -->
          <div v-show="active === 3">
            <el-result
              icon="success"
              title="重置密码成功"
              sub-title="点击返回登录页"
            >
            <template #extra>
              <el-button type="success" @click="router.push('/login')">登录页</el-button>
            </template>
          </el-result>
          </div>
        </div>
      </main>

      <div class="bottom-btn">
        <el-button v-show="active < 2 && active > 0" style="margin-top: 12px"  @click="last">上一步</el-button>
        <el-button v-show="active < 3" style="margin-top: 12px" :disabled="nextDisabled" @click="next">下一步</el-button>
        <el-button style="margin-top: 12px" type="success" @click="router.replace('/home')">首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref,watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/store/login'
import { Lock ,Message,Key} from '@element-plus/icons-vue'
import {warning} from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'

const router = useRouter()
const loginStore = useLoginStore()

// 步骤条
const active = ref(0)

// 下一步按钮禁用
const nextDisabled = ref(true)

// 登录表单数据
const emailFrom = reactive({
  email: '',
})
// 重置密码表单
const resetPwdFromRef = ref(null)
// 重置密码表单数据
const resetPwdFrom = reactive({
  code: '',
  password: '',
  confirmPassword: ''
})

// 验证密码是否相同
const validatePwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== resetPwdFrom.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 验证规则
const rules = reactive({
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    { min: 6, max: 6, message: '长度应该为6个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度应该在6~12个字符之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度应该在6~12个字符之间', trigger: 'blur' },
    { validator: validatePwd, trigger: 'blur' }
  ],
})

const next = () => {
  nextDisabled.value = true
  if (active.value++ > 2) active.value = 0
}

const last = () => {
  nextDisabled.value = false
  if (active.value-- < 1) active.value = 0
}

// 禁用获取验证码按钮
const getCodeBtn = ref(false)
// 等待时间
const waitTime = ref(60)
// 定义定时器
let intervalId
let timerId
// 获取验证码
const reSetPwdCode = () => {
  if(emailFrom.email === '') return warning('请输入邮箱')

  // 获取当前时间戳，单位为秒
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // 从LocalStorage中获取上次获取验证码的时间戳
  const resetLastGetCodeTime = getItem('resetLastGetCodeTime');

  // 清除上次的定时器
  clearInterval(intervalId);
  clearTimeout(timerId);

  // 禁用按钮
  getCodeBtn.value = true;

  // 如果有上次获取验证码的时间戳，则等待时间等于60 - (现在的时间戳 - 上次的时间戳)
  if(resetLastGetCodeTime) {
    // 如果没有清除上次的定时器，waitTime小于0，则waitTime等于60,否则就是剩余的时间
    waitTime.value = 60 - (currentTimestamp - resetLastGetCodeTime) <= 0 ? 60 : 60 - (currentTimestamp - resetLastGetCodeTime)
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
      removeItem('resetLastGetCodeTime')
      // waitTime恢复到60
      waitTime.value = 60
    }
  }, waitTime.value * 1000);


  // 如果上次时间戳存在且时间差小于等于 60 秒，则返回警告信息并结束函数
  if (resetLastGetCodeTime && currentTimestamp - resetLastGetCodeTime <= 60) {
    return warning(`请等待${waitTime.value}秒后再获取验证码`);
  }

  // 将当前时间戳保存到LocalStorage
  setItem('resetLastGetCodeTime', currentTimestamp);
  // 获取验证码
  loginStore.getResetPwdCodeFun(emailFrom.email);
};

// 注册并校验所有数据
const submitResetPwdFromForm = async (formEl) => {
  if (!formEl) return ;
  await formEl.validate((valid, fields) => {
    // 校验通过
    if (valid) {
      loginStore.resetPwdFun(resetPwdFrom, emailFrom).then(() => {
        // 
        if(loginStore.isResetPwd) {

          active.value = 3
          // 清空信息
          formEl.resetFields()
        }
      })
    } else {
      warning('请输入相关信息')
    }
  })
}

// 监听active变化
watch(active, (newVal, oldVal) => {
  // 略过2,直接成功(0为获取验证码, 1为提交验证码及密码)
  if (newVal === 2) active.value = 3;
  // 1时,禁止下一步
  if (active.value === 1) nextDisabled.value = true; 
})
// 监听邮箱是否为空
watch(emailFrom, (newVal, oldVal) => {
  if (active.value === 0 && newVal.email) nextDisabled.value = false;
})
</script>

<style lang="scss" scoped>
.content-box {
  padding: 50px;
  background-color: #f0f2f5;
  background: url('../../assets/bg/bg-7.jpg') no-repeat center/cover;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  box-sizing: border-box;
  height: 100%;
  background: rgba(255, 255, 255, 0.8); /* 内容区域背景，根据需要调整 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

  h1 {
    margin: 20px;
  }

  main {
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 100%;

    .steps-area {
      width: 40%;
      // margin: 20px 0;
    }

    .steps-content {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 50px 0;
      width: 100%;
    }
  }

  .bottom-btn {
    position: absolute;
    bottom: 50px;

  }
}

@media (max-width: 768px) {
  .content-box {
    padding: 10px;
  }
  .content {
    padding: 20px;

    main {
      
      .steps-area {
        width: 100%;
    }
    }
  }
}
</style>
