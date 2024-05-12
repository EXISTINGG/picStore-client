import {defineStore} from 'pinia'
import {getAlbum,getAlbumFile,addAlbum,deleteAlbum,updateAlbum} from '@/api/home'
import {success,warning,error} from '@/utils/message'

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      // 相册列表
      albumList: [],
      // 图片列表
      imgList: [],
      // 当前album
      currentAlbum: '',
      // 当前albumID
      currentAlbumId: '',
      // 下次请求偏移量
      offset: 0,
      // 顶部菜单高度：
      topMenuH: 0,
      // h1高度
      h1H: 0,
      // 左侧相册高度
      albumHeight: 0,
      // 禁用加载
      disabledLoad: false,
      // 删除相册是否成功
      isDelAlbum: false
    }
  },

  getters: {
    // 第一个album
    firstAlbum: state => state.albumList[0]?.name,
    // 第一个albumID
    firstAlbumId: state => state.albumList[0]?.id,
    // 图片链接
    imgPreviewList: state => state.imgList.map(item => item.file_url),
    // 首页相册要减去高度(window - h1 - topMenu)
    homeH: state => state.h1H + state.topMenuH
  },

  actions: {
    // 获取相册
    async getAlbumList() {
      const {data} = await getAlbum()
      if(data.status !== 200) return error('获取相册失败')
      this.albumList = data.data;
    },
    
    // 获取相册下的文件
    async getImgList(id,name,changeAlbum,offset, batchSize) {
      if(changeAlbum) {
        this.disabledLoad = false
        this.offset = 0
      }

      if(this.disabledLoad) return warning('没有更多了');

      const {data} = await getAlbumFile(id,name,offset,batchSize);

      if(data.status !== 200) return error('获取图片失败');

      if(data.data.length === 0) {
        this.disabledLoad = true;
        success('图片加载完毕');
      };

      // 切换相册
      if(changeAlbum) {
        this.imgList = [];
        this.imgList = data.data;
      } else {
        // 加载(新数据在后,旧数据在前)
        this.imgList.splice(this.imgList.length, 0, ...data.data);
      };

      this.offset = data.nextOffset;
    },

    // 新建相册
    async addAlbumFun(albumName, privacy) {
      
      const {data} = await addAlbum(albumName, String(privacy))
      if(data.status !== 200) return error(data.message || '新建相册失败')
      success(data.message)
      this.getAlbumList()
    },

    // 删除相册
    async deleteAlbumFun(id,albumName) {
      this.isDelAlbum = false
      const {data} = await deleteAlbum(String(id),albumName)
      if(data.status !== 200) return error(data.message || '删除相册失败')
      success(data.message)
      this.isDelAlbum = true
      // this.getAlbumList()
    },

    // 更新相册信息
    async updateAlbumFun(id, albumName, newAlbumName, newPrivacy) {
      const {data} = await updateAlbum(String(id), albumName, newAlbumName, String(newPrivacy))
      if(data.status !== 200) return error(data.message || '更新相册信息失败')
      success(data.message)
      this.getAlbumList()
    },
  }
})