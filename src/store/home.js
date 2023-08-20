import {defineStore} from 'pinia'
import {getFolder,getFolderFile,addFolder,deleteFolder,renameFolder} from '@/api/home'
import {success,warning,error} from '@/utils/message'

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      // 目录列表
      folderList: [],
      // 图片列表
      imgList: [],
      // 当前folder
      currentFolder: '',
      // 顶部菜单高度：
      topMenuH: 0,
      // h1高度
      h1H: 0,
      // 左侧目录高度
      folderHeight: 0,
      // 禁用加载
      disabledLoad: false,
    }
  },

  getters: {
    // 第一个folder
    firstFolder: state => state.folderList[0],
    // 图片链接
    imgPreviewList: state => state.imgList.map(item => item.url),
    // 首页目录要减去高度(window - h1 - topMenu)
    homeH: state => state.h1H + state.topMenuH
  },

  actions: {
    // 获取目录
    async getFolderList() {
      const {data} = await getFolder()
      if(data.status !== 200) return error('获取目录失败')
      this.folderList = data.allFolder
      console.log(this.folderList);
    },
    
    // 获取目录下的文件
    async getImgList(folder,size,isRefresh,changeFolder) {
      if(isRefresh || changeFolder) this.disabledLoad = false
      if(this.disabledLoad) return warning('没有更多了')
      console.log(1212,folder);
      const {data} = await getFolderFile(folder,size,isRefresh)
      console.log(data.data);
      if(data.status !== 200) return error('获取图片失败')
      if(data.data.files.length === 0) {
        this.disabledLoad = true
        success('图片加载完毕')
      }
      // 切换目录
      if(changeFolder) {
        this.imgList = []
        this.imgList = data.data.files
      } else {
        // 加载(新数据在后,旧数据在前)
        this.imgList.splice(this.imgList.length, 0, ...data.data.files)
      }
    },

    // 新建目录
    async addFolderFun(folder) {
      const {data} = await addFolder(folder)
      console.log(data);
      if(data.status !== 200) return error(data.message || '新建目录失败')
      success(data.message)
      this.getFolderList()
    },

    // 删除目录
    async deleteFolderFun(folder) {
      const {data} = await deleteFolder(folder)
      if(data.status !== 200) return error(data.message || '删除目录失败')
      success(data.message)
      this.getFolderList()
    },

    // 重命名目录
    async renameFolderFun(oldName,newName) {
      const {data} = await renameFolder(oldName,newName)
      if(data.status !== 200) return error(data.message || '重命名目录失败')
      success(data.message)
      this.getFolderList()
    },
  }
})