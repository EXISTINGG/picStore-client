import { defineStore } from "pinia";
import {deleteImg,renameImg} from '@/api/image'
import {success,warning,error} from '@/utils/message'

export const useImgStore = defineStore('img', {
  state: () => {
    return {
      isDelete: false,
      isRename: false
    }
  },

  actions: {
    // 删除图片
    async deleteImgFun(folder,file) {
      const {data} = await deleteImg(folder,file)
      console.log(data);
      if(data.status !== 200) return error(data.message ||'删除图片失败')
      success('删除图片成功')
      this.isDelete = true
    },
    // 重命名图片
    async renameImgFun(folder,oldName,newName) {
      const {data} = await renameImg(folder,oldName,newName)
      console.log(data);
      if(data.status !== 200) return error(data.message ||'重命名图片失败')
      success('重命名图片成功')
      this.isRename = true
    },
  }
})