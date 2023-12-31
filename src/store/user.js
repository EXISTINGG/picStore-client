import {defineStore} from 'pinia'
import {updateInfo,updatepwd,deleteUser,getChangeEmailCode, changeEmail} from '@/api/user'
import {success,warning,error} from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'
import {useLoginStore} from './login'

const loginStore = useLoginStore()


export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // 修改密码成功?
      isUpdatePwd: false,
      // 注销账号成功?
      isdeleteUser: false,
      // 更换邮箱成功?
      isChangeEmail: false,
    }
  },

  getters: {
    
  },

  actions: {
    async updateInfoFun(username) {
      const {data} = await updateInfo(username)
      if(data.status !== 200) return warning(data.message || '更新信息失败')
      success('更新信息成功')
      setItem('TOKEN',data.data.token)
      setItem('user',data.data.user)
      // 用于更新首页用户名
      loginStore.user = getItem('user')
    },

    async upDatePwdFun(form) {
      const {data} = await updatepwd(form.oldPassword,form.password)
      if(data.status !== 200) return warning(data.message || '修改密码失败')
      this.isUpdatePwd = true
      // success('修改密码成功')
      // setItem('TOKEN',data.data.token)
      // loginStore.logOutFun()
    },

    async deleteUserFun() {
      this.isdeleteUser = false
      const {data} = await deleteUser()
      if(data.status !== 200) return warning(data.message || '注销失败')
      this.isdeleteUser = true
    },

    async getChangeEmailCodeFun(emailFrom) {
      const {data} = await getChangeEmailCode(emailFrom.email, emailFrom.passwordEmail)
      if(data.status !== 200) return warning(data.message || '获取验证码失败')
      success('获取验证码成功')
    },

    async changeEmailFun(emailFrom, code) {
      this.isChangeEmail = false
      const {data} = await changeEmail(emailFrom.email, code)
      if(data.status !== 200) return warning(data.message || '修改邮箱失败')
      success('修改邮箱成功')
      this.isChangeEmail = true
      }
  }
})