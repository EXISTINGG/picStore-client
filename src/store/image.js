import { defineStore } from "pinia";
import {deleteImg} from '@/api/image'
import {success,warning,error} from '@/utils/message'

export const useImgStore = defineStore('img', {
  state: () => {
    return {
      isDelete: false,
    }
  },

  actions: {
    // 删除图片
    async deleteImgFun(id, name) {
      this.isDelete = false
      const {data} = await deleteImg(String(id), name)
      if(data.status !== 200) return error(data.message ||'删除图片失败')
      success('删除图片成功')
      this.isDelete = true
    },

    // // 重命名图片(废弃)
    // async renameImgFun(album,oldName,newName) {
    //   const {data} = await renameImg(album,oldName,newName)
    //   if(data.status !== 200) return error(data.message ||'重命名图片失败')
    //   success('重命名图片成功')
    //   this.isRename = true
    // },
  }
})