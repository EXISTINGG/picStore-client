import { defineStore } from 'pinia'

export const useImgStore = defineStore('img', {
  state: () => {
    return {
      iconFile: [],
      faviconFile: [],
      imageFile: [],
      ImgList: [],
    }
  },

  getters: {
    imgPreviewList: state => state.ImgList.map(item => item.url)
  },

  actions: {
    getImgFile(type) {
      switch (type) {
        case 'favicon':
          this.faviconFile = import.meta.glob('@/assets/favicon/*') //限制类型'../assets/image/*.{png,jpg,jpeg,svg}'
          this.readImgFile(this.faviconFile)
          break
        case 'icon':
          this.iconFile = import.meta.glob('@/assets/icon/*')
          this.readImgFile(this.iconFile)
          break
        default:
          this.imageFile = import.meta.glob('@/assets/image/*')
          this.readImgFile(this.imageFile)
          break
      }
    },

    readImgFile(data) {
      Object.values(data).forEach(async (image) => {
        const url = await image()
        const imgName = url.default.substring(url.default.lastIndexOf('/') + 1);
        this.ImgList.push({url:url.default,imgName})
      })
    }

  }
})
