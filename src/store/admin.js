import {defineStore} from 'pinia'
import {getApiList,changeApi,getUserList,changeUser,getsignOutUserList,delUser,deletesignOutUser,restoreUser} from '@/api/admin'
import {success,warning} from '@/utils/message'

export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      apiList: [],
      userList: [],
      outUserList: [],
      isDelSuccess: false,
      isResoterSuccess: false
    }
  },

  getters: {
    
  },

  actions: {
   async getApiListFun() {
     const {data} = await getApiList()
     if(data.status !== 200) return warning(data.message || '获取api列表失败')
     this.apiList = data.data.interace
   },

   async changeApiFun(val) {
     const {data} = await changeApi(String(val.id),val.interface,String(val.power))
     if(data.status !== 200) return warning(data.message || '修改权限失败')
     success('修改成功')
   },

   async getUserListFun() {
    const {data} = await getUserList()
    if(data.status !== 200) return warning(data.message || '获取用户列表失败')
    this.userList = data.data.userList
  },

  async changeUserFun(val) {
    const {data} = await changeUser(String(val.power),val.username,String(val.id))
    if(data.status !== 200) return warning(data.message || '修改权限失败')
    success('修改成功')
  },

  async getsignOutUserListFun() {
    const {data} = await getsignOutUserList()
    if(data.status !== 200) return warning(data.message || '获取注销用户列表失败')
    this.outUserList = data.data.userList
  },
  
  async delUserFun(val) {
    this.isDelSuccess = false
    const {data} = await delUser(val.username,String(val.id))
    if(data.status !== 200) return warning(data.message || '删除失败')
    success('删除成功')
    this.isDelSuccess = true
  },
  
  async deletesignOutUserFun() {
    this.isDelSuccess = false
    const {data} = await deletesignOutUser()
    if(data.status !== 200) return warning(data.message || '删除失败')
    success('删除成功')
    this.isDelSuccess = true
  },

  async restoreUserFun(val) {
    this.isResoterSuccess = false
    const {data} = await restoreUser(val.username,String(val.id))
    if(data.status !== 200) return warning(data.message || '恢复失败')
    success('恢复成功')
    this.isResoterSuccess = true
  },
  }
})