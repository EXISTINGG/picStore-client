import {defineStore} from 'pinia'
import {getApiList,changeApi,getUserList,changeUser,getsignOutUserList,delUser,deletesignOutUser,restoreUser,getSystem, changeSystem, getAlbumList,getAllImage} from '@/api/admin'
import {success,warning} from '@/utils/message'

export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      apiList: [],
      userList: [],
      outUserList: [],
      allAlbumList: [],
      allImgList: [],
      systemConfig: {},
      // 下次请求偏移量
      offset: 0,
      isDelSuccess: false,
      isResoterSuccess: false,
      ischangeSystem: false,
      // 禁用加载更多
      disabledMore: false,
      // 数据加载中
      loading: false
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
     const {data} = await changeApi(String(val.id),val.name,String(val.required_permissions))
     if(data.status !== 200) return warning(data.message || '修改权限失败')
     success('修改成功')
   },

   async getUserListFun() {
    const {data} = await getUserList()
    if(data.status !== 200) return warning(data.message || '获取用户列表失败')
    this.userList = data.data.userList
  },

  async changeUserFun(val) {
    const {data} = await changeUser(String(val.permissions),val.username,String(val.id))
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

  // 获取系统配置
  async getSystemConfigFun() {
    const {data} = await getSystem()
    if(data.status !== 200) return warning(data.message || '获取系统配置失败')
    this.systemConfig = data.data.systemset
  },

  // 更改系统配置
  async changeSystemFun(storage_type, cloud_disk_capacity, local_disk_capacity) {
    this.ischangeSystem = false;
    const {data} = await changeSystem(storage_type, cloud_disk_capacity, local_disk_capacity)
    if(data.status !== 200) return warning(data.message || '更改系统配置失败')
    success('更改系统配置成功')
    this.ischangeSystem = true;
  },

  // 获取所有相册
  async getAllAlbumFun() {
    const {data} = await getAlbumList()
    if(data.status !== 200) return warning(data.message || '获取所有相册失败')
    this.allAlbumList = data.data.alnums
  },

  // 获取所有图片
  async getAllImgFun(offset,batchSize) {
    const {data} = await getAllImage(offset,batchSize)
    if(data.status !== 200) return warning(data.message || '获取图片失败');

    if(data.count === 0) {
      this.disabledMore = true
      return warning('没有更多了');
    }

    if(offset === 0) {
      this.allImgList = []
      this.disabledMore = false
    }

    this.allImgList.splice(this.allImgList.length, 0, ...data.data.images);
    this.offset = data.nextOffset;
  }

  }
})