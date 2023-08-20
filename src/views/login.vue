<template>
  <!-- 加载动画，解决以服务的方式调用动画不在中心的bug -->
  <!-- <i v-loading.fullscreen.lock="fullscreenLoading"></i> -->
  <!-- 最外层的大盒子 -->
  <div class="bigBox">
    <div class="box" ref="box">
      <!-- 滑动盒子 -->
      <div ref="preboxRef" class="pre-box">
        <h1>WELCOME</h1>
        <p>{{flag ? '欢迎回来！请输入以下信息进行登录。' : '欢迎加入我们！填写以下信息创建新账户。'}}</p>
        <!-- 欢迎回来！请输入您的用户名和密码进行登录。 -->
        <div class="img-box">
          <img :src="flag ? loginBg : registerBg" alt=""/>
        </div>
      </div>
      <!-- 注册盒子 -->
      <div class="register-form">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>注册</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          label-with="5px">
          <el-form-item prop="username" label=" ">
            <el-input
              type="text"
              placeholder="用户名"
              :prefix-icon="User"
              clearable
              maxlength="7"
              show-word-limit
              v-model.trim="registerForm.username"
            />
          </el-form-item>
          <el-form-item prop="email" label=" ">
            <el-input
              type="text"
              placeholder="邮箱"
              :prefix-icon="Message"
              clearable
              v-model.trim="registerForm.email"
            />
          </el-form-item>
          <el-form-item prop="code" label=" " class="code-form">
            <el-input
              type="text"
              placeholder="验证码"
              :prefix-icon="Key"
              clearable
              maxlength="6"
              v-model.trim="registerForm.code"
              class="code-input"
            />
            <el-button type="primary" round class="code-btn" :disabled="disabledBtn" @click="RegGetCode">{{disabledBtn ? `${waitTime}` : '获取验证码'}}</el-button>
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="registerForm.password"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" label=" ">
            <el-input
              type="password"
              placeholder="确认密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="registerForm.confirmPassword"
            />
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="submitRegisterForm(registerFormRef)">注册</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch">已有账号?去登录</p>
        </div>
      </div>
      <!-- 登录盒子 -->
      <div class="login-form">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>登录</h1>
        </div>
        <div class="login-method">
            <span :class="loginActive === 0 ? 'border' : ''" @click="selectLogin(0)">用户名登录</span>
            <span :class="loginActive === 1 ? 'border' : ''" @click="selectLogin(1)">邮箱登录</span>
        </div>
        <!-- 表单区(登录) -->
        <div class="login-area">
                  <!-- 输入框盒子(用户名) -->
        <transition name="el-zoom-in-center">
        <el-form
          ref="userNameloginFormRef"
          :model="userNameLoginForm"
          :rules="rules"
          label-with="5px"
          class="login-form-box"
          v-show="loginActive === 0"
        >
          <el-form-item prop="username" label=" ">
            <el-input
              type="text"
              placeholder="用户名"
              :prefix-icon="User"
              clearable
              maxlength="7"
              show-word-limit
              v-model.trim="userNameLoginForm.username"
            />
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="userNameLoginForm.password"
            />
          </el-form-item>
        </el-form>
        </transition>
        <!-- 输入框盒子(邮箱) -->
        <transition name="el-zoom-in-center">
        <el-form
          ref="emailLoginFormRef"
          :model="emailLoginForm"
          :rules="rules"
          label-with="5px"
          class="login-form-box"
          v-show="loginActive === 1"
        >
          <el-form-item prop="email" label=" ">
            <el-input
              type="text"
              placeholder="邮箱"
              :prefix-icon="Message"
              clearable 
              v-model.trim="emailLoginForm.email"
            />
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="emailLoginForm.password"
            />
          </el-form-item>
        </el-form>
         </transition>
        </div>

        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="submitLoginForm(loginActive === 0 ? userNameloginFormRef : emailLoginFormRef)">登录</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch">没有账号?去注册</p>
        </div>
      </div>

      <!-- 移动端 -->
      <div class="mobile-box">
        <!-- 注册盒子 -->
      <div class="register-form" v-show="!flag">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>注册</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          label-with="5px">
          <el-form-item prop="username" label=" ">
            <el-input
              type="text"
              placeholder="用户名"
              :prefix-icon="User"
              clearable
              maxlength="7"
              show-word-limit
              v-model.trim="registerForm.username"
            />
          </el-form-item>
          <el-form-item prop="email" label=" ">
            <el-input
              type="text"
              placeholder="邮箱"
              :prefix-icon="Message"
              clearable
              v-model.trim="registerForm.email"
            />
          </el-form-item>
          <el-form-item prop="code" label=" " class="code-form">
            <el-input
              type="text"
              placeholder="验证码"
              :prefix-icon="Key"
              clearable
              maxlength="6"
              v-model.trim="registerForm.code"
              class="code-input"
            />
            <el-button type="primary" round class="code-btn" :disabled="disabledBtn" @click="RegGetCode">{{disabledBtn ? `${waitTime}` : '获取验证码'}}</el-button>
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="registerForm.password"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" label=" ">
            <el-input
              type="password"
              placeholder="确认密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="registerForm.confirmPassword"
            />
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="submitRegisterForm(registerFormRef)">注册</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch">已有账号?去登录</p>
        </div>
      </div>
      <!-- 登录盒子 -->
      <div class="login-form" v-show="flag">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>登录</h1>
        </div>
        <div class="login-method">
            <span :class="loginActive === 0 ? 'border' : ''" @click="selectLogin(0)">用户名登录</span>
            <span :class="loginActive === 1 ? 'border' : ''" @click="selectLogin(1)">邮箱登录</span>
        </div>
        <!-- 表单区(登录) -->
        <div class="login-area">
                  <!-- 输入框盒子(用户名) -->
        <transition name="el-zoom-in-center">
        <el-form
          ref="userNameloginFormRef"
          :model="userNameLoginForm"
          :rules="rules"
          label-with="5px"
          class="login-form-box"
          v-show="loginActive === 0"
        >
          <el-form-item prop="username" label=" ">
            <el-input
              type="text"
              placeholder="用户名"
              :prefix-icon="User"
              clearable
              maxlength="7"
              show-word-limit
              v-model.trim="userNameLoginForm.username"
            />
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="userNameLoginForm.password"
            />
          </el-form-item>
        </el-form>
        </transition>
        <!-- 输入框盒子(邮箱) -->
        <transition name="el-zoom-in-center">
        <el-form
          ref="emailLoginFormRef"
          :model="emailLoginForm"
          :rules="rules"
          label-with="5px"
          class="login-form-box"
          v-show="loginActive === 1"
        >
          <el-form-item prop="email" label=" ">
            <el-input
              type="text"
              placeholder="邮箱"
              :prefix-icon="Message"
              clearable 
              v-model.trim="emailLoginForm.email"
            />
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
              clearable
              maxlength="12"
              v-model.trim="emailLoginForm.password"
            />
          </el-form-item>
        </el-form>
         </transition>
        </div>

        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="submitLoginForm(loginActive === 0 ? userNameloginFormRef : emailLoginFormRef)">登录</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch">没有账号?去注册</p>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted,onBeforeUnmount } from 'vue'
import { Lock, User ,Message,Key} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {useLoginStore} from '@/store/login'
import {success,warning,error} from '@/utils/message'
import {getItem,setItem} from '@/utils/localStorage'
import loginBg from '@/assets/image/flsx_bg.jpg'
import registerBg from '@/assets/image/qcsj_bg.jpg'

// const fullscreenLoading = ref(false)
const router = useRouter()
const loginStore = useLoginStore()

// 登录表单数据
const userNameLoginForm = reactive({
  username: '',
  password: ''
})
const emailLoginForm = reactive({
  email: '',
  password: ''
})
const registerForm = reactive({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

// 用户名登录表单
const userNameloginFormRef = ref(null)
// 邮箱登录表单
const emailLoginFormRef = ref(null)
// 注册表单
const registerFormRef = ref(null)
// 滑动的盒子
const preboxRef = ref(null)
// 登录方式，0：用户名， 1：邮箱
const loginActive = ref(0)
// 注册？登录？ true则在登录页面
const flag = ref(true)

// 验证密码是否相同
const validatePwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 7, message: '长度应该在1~7个字符之间', trigger: 'blur' },
  ],
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

// 禁用按钮
const disabledBtn = ref(false)
// 等待时间
const waitTime = ref(60)
// 定义定时器
let intervalId
let timerId
// 获取验证码
const RegGetCode = () => {
  if(registerForm.email === '') return warning('请输入邮箱')

  // 获取当前时间戳，单位为秒
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // 从LocalStorage中获取上次获取验证码的时间戳
  const lastGetCodeTimestamp = localStorage.getItem('lastGetCodeTimestamp');

  // 清除上次的定时器
  clearInterval(intervalId);
  clearTimeout(timerId);

  // 禁用按钮
  disabledBtn.value = true;

  // 如果有上次获取验证码的时间戳，则等待时间等于60 - (现在的时间戳 - 上次的时间戳)
  if(lastGetCodeTimestamp) {
    // 如果没有清除上次的定时器，waitTime小于0，则waitTime等于60,否则就是剩余的时间
    waitTime.value = 60 - (currentTimestamp - lastGetCodeTimestamp) <= 0 ? 60 : 60 - (currentTimestamp - lastGetCodeTimestamp)
  }

  // waitTime每秒减一
    intervalId = setInterval(() => {
      waitTime.value--
      console.log('yx');
    }, 1000);

  timerId = setTimeout(() => {
    // 在等待时间后启用按钮
    disabledBtn.value = false;

    if(waitTime.value <= 0) {
      // 如果waitTime小于0，清除定时器
      clearInterval(intervalId);
      clearTimeout(timerId);
      // 移除上次的时间戳，以防waitTime为负数，导致点击后立即启用按钮
      localStorage.removeItem('lastGetCodeTimestamp')
      // waitTime恢复到60
      waitTime.value = 60
    }
  }, waitTime.value * 1000);


  // 如果上次时间戳存在且时间差小于等于 60 秒，则返回警告信息并结束函数
  if (lastGetCodeTimestamp && currentTimestamp - lastGetCodeTimestamp <= 60) {
    return warning(`请等待${waitTime.value}秒后再获取验证码`);
  }

  // 将当前时间戳保存到LocalStorage
  localStorage.setItem('lastGetCodeTimestamp', currentTimestamp);
  // 获取验证码
  loginStore.getCodeValue(registerForm.email);
};



// 注册并校验所有数据
const submitRegisterForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 校验通过
    if (valid) {
      loginStore.registerAccountFun(registerForm).then(() => {
        // 如果登录了
        if(loginStore.isRegister) {
          // 将登录页的信息填上
          userNameLoginForm.username = registerForm.username
          userNameLoginForm.password = registerForm.password
          // 清空信息
          formEl.resetFields()
          // 切换到登录
          mySwitch()
        }
      })
    } else {
      warning('请输入相关信息')
    }
  })
}

// 登录并校验所有数据
const submitLoginForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // 验证通过
    if (valid) {
      // 用户名登录
      if(loginActive.value === 0) {
        loginStore.loginByUserNameFun(userNameLoginForm).then(() => {
          // 登陆成功，跳转到首页
          console.log('loginStore.isLogin',loginStore.isLogin);
          if(loginStore.isLogin) {setTimeout(() => {router.push('/home')}, 1000);}
        });
      } else if (loginActive.value === 1) {
        loginStore.loginByEmailFun(emailLoginForm).then(() => {
          // 登陆成功，跳转到首页
          if(loginStore.isLogin) {setTimeout(() => {router.push('/home')}, 1000);}
        });
      }
    } else {
      warning('请输入相关信息')
    }
  })
}

// 切换登录方式
const selectLogin = (i) => {
  if(loginActive.value === i) return
  loginActive.value = i
}

// 切换登录或注册
const mySwitch = () => {
  console.log(flag.value);
    if (flag.value) {
        preboxRef.value.style.transform = "translateX(100%)"
        preboxRef.value.style.backgroundColor = "#c9e0ed"
    }
    else {
        preboxRef.value.style.transform = "translateX(0%)"
        preboxRef.value.style.backgroundColor = "#edd4dc"
    }
    flag.value = !flag.value
}

onBeforeUnmount(() => {
  clearInterval(intervalId);
  clearTimeout(timerId);
})
</script>

<style lang="scss" scoped>
/* 去除input的轮廓 */
input {
  outline: none;
}

.bigBox {
   position: fixed;
  /* 设置元素的左、上、右、下位置 */
  top: 0;
  left: 0;
  /* 溢出隐藏 */
  /* height: 100vh; */
  height: 100%;
  width: 100%;
  /* overflow-x: hidden; */
  display: flex;
  /* 渐变方向从左到右 */
  background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
}

/* 最外层的大盒子 */
.box {
  width: 70%;
  height: 70%;
  display: flex;
  /* 相对定位 */
  position: relative;
  z-index: 2;
  margin: auto;
  /* 设置圆角 */
  border-radius: 8px;
  /* 设置边框 */
  border: 1px solid rgba(255, 255, 255, 0.6);
  /* 设置盒子阴影 */
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
  /* backdrop-filter: blur(20px); */
}
.mobile-box {
  display: none;
}

/* 滑动的盒子 */
.pre-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 宽度为大盒子的一半 */
  width: 50%;
  height: 100%;
  /* 绝对定位 */
  position: absolute;
  /* 距离大盒子左侧为0 */
  left: 0;
  /* 距离大盒子顶部为0 */
  top: 0;
  z-index: 99;
  border-radius: 4px;
  background-color: #edd4dc;
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
  /* 动画过渡，先加速再减速 */
  transition: 0.5s ease-in-out;
}

/* 滑动盒子的标题 */
.pre-box h1 {
  margin-top: 150px;
  text-align: center;
  /* 文字间距 */
  letter-spacing: 5px;
  color: white;
  /* 禁止选中 */
  user-select: none;
  /* 文字阴影 */
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);

}

/* 滑动盒子的文字 */
.pre-box p {
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0;
  /* 禁止选中 */
  user-select: none;
  font-weight: bold;
  color: white;
  font-size: 16px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片盒子 */
.img-box {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  /* 设置为圆形 */
  border-radius: 50%;
  /* 设置用户禁止选中 */
  user-select: none;
  overflow: hidden;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片 */
.img-box img {
  width: 100%;
  height: 100%;
  transition: 0.5s;
  object-fit: cover;
}

/* 登录和注册盒子 */
.login-form,
.register-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

/* 标题盒子 */
.title-box {
  /* height: 300px; */
  /* line-height: 500px; */
}

.login-method {
  display: flex;
  justify-content: center;
}

.login-method span {
  padding: 5px 10px;
  color: white;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

.login-method .border {
  border-bottom: 3px solid #fff;
  border-radius: 1px;
}

/* 标题 */
.title-box h1 {
  text-align: center;
  color: white;
  /* 禁止选中 */
  user-select: none;
  letter-spacing: 5px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}

.login-area {
  display: flex;
  position: relative;
  height: 100px;
  justify-content: center;
}

/* 输入框盒子 */
.el-form {
  display: flex;
  /* 纵向布局 */
  flex-direction: column;
  /* 水平居中 */
  align-items: center;
  padding: 5px 0;
}

.el-form .code-form {
  display: flex;
  align-items: center;
  flex-wrap: none;
}

.code-form .code-input {
  flex: 1;
}

.code-form .code-btn {
  width: 25%;
  font-size: 10px;
  margin-left: 10px;
}

.login-form-box {
  position: absolute;
  width: 100%;
}

.el-form-item {
  width: 65%;
}
/* 输入框 */
input {
  /* width: 60%; */
  height: 40px;
  margin-bottom: 20px;
  text-indent: 10px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 120px;
  /* 增加磨砂质感 */
  backdrop-filter: blur(10px);
}

input:focus {
  /* 光标颜色 */
  color: #b0cfe9;
}

/* 聚焦时隐藏文字 */
input:focus::placeholder {
  opacity: 0;
}

/* 按钮盒子 */
.btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 按钮 */
.btn-box button {
  width: 100px;
  height: 30px;
  margin: 5px 7px;
  line-height: 30px;
  border: none;
  border-radius: 4px;
  background-color: #69b3f0;
  color: white;
}

/* 按钮悬停时 */
button:hover {
  /* 鼠标小手 */
  cursor: pointer;
  /* 透明度 */
  opacity: 0.8;
}

/* 按钮文字 */
.btn-box p {
  height: 30px;
  line-height: 30px;
  /* 禁止选中 */
  user-select: none;
  font-size: 14px;
  color: white;
}

.btn-box p:hover {
  cursor: pointer;
  border-bottom: 1px solid white;
}

@media (max-width: 768px) {
  .pre-box,.register-form,.login-form {
    display: none;
  }

  .mobile-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .register-form,.login-form {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .login-form .login-area {
      display: flex;
      justify-content: center;
      height: 100px;
      width: 90%;


    .el-form-item {
      width: 90%;
    }
    }  
}
}
</style>