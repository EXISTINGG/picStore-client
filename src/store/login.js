import { defineStore } from 'pinia'
import {
  getCode,
  registerAccount,
  loginByUserName,
  loginByEmail,
  getResetPwdCode,
  resetPwd
} from '@/api/login'
import { success, warning, error } from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'

export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      // 用户信息
      user: getItem('user') || {},
      // 是否注册成功
      isRegister: false,
      // 是否登录
      isLogin: false,
      // 重置密码成功?
      isResetPwd: false,
    }
  },

  getters: {
   
  },

  actions: {
    // 获取验证码
    async getCodeValue(email) {
      const { data } = await getCode(email)
      if (data.status !== 200) return warning('获取验证码失败')
      success('获取验证码成功')
    },

    // 注册
    async registerAccountFun(regForm) {
      this.isRegister = false
      const { data } = await registerAccount(
        regForm.email,
        regForm.code,
        regForm.username,
        regForm.password
      )
      if (data.status !== 200) return warning(data.message || '注册失败')
      success('注册成功')
      this.isRegister = true
    },

    // 用户名登录
    async loginByUserNameFun(userNameForm, isadmin) {
      const { data } = await loginByUserName(
        userNameForm.username,
        userNameForm.password,
        isadmin
      )
      // 处理数据
      this.processData(data)
    },

    // 邮箱登录
    async loginByEmailFun(emailForm, isadmin) {
      const { data } = await loginByEmail(
        emailForm.email,
        emailForm.password,
        isadmin
      )
      // 处理数据
      this.processData(data)
    },

    // 登录处理
    processData(data) {
      if (data.status !== 200) return warning(data.message || '登录失败')
      success('登录成功')
      this.user = data.data.user
      setItem('TOKEN', data.data.token)
      setItem('user', data.data.user)
      this.isLogin = true
    },

    // 退出登录
    async logOutFun() {
      // 删除数据
      await removeItem('TOKEN')
      await removeItem('user')
      this.isLogin = false
    },

    // 忘记密码,获取重置密码的验证码
    async getResetPwdCodeFun(email) {
      const {data} = await getResetPwdCode(email)
      if (data.status !== 200) return warning(data.message || '获取失败')
      success('获取成功')
    },

     // 重置密码
     async resetPwdFun(resetForm, emailFrom) {
      this.isResetPwd = false
      const { data } = await resetPwd(
        emailFrom.email,
        resetForm.code,
        resetForm.password
      )
      if (data.status !== 200) return warning(data.message || '重置密码失败')
      success('重置密码成功')
      this.isResetPwd = true
    },
  }
})
