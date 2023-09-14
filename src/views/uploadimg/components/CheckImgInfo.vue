<template>
  <div class="result-area" :style="{ height: calculateMaxHeight() }">
    <div class="progress-box">
      <h3>上传进度:</h3>
      <el-progress
        :percentage="checkImg.checkProgress"
        :stroke-width="15"
        :status="checkImg.checkImg"
        striped
        :duration="checkImg.isLoading ? 10 : 0"
        striped-flow
      />
    </div>

    <section class="img-info">
      <div class="left-img">
        <el-image
          :src="checkImg.blobUrl || checkImg.name"
          fit="contain"
          :class="showImgMask ? 'img-mask' : 'img'"
        />
        <div class="switch-area">
          <i>遮罩层</i>
          <el-switch
            v-model="showImgMask"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          />
        </div>
      </div>

      <div class="right-info">
        <div class="info-header">
          <h1 class="img-name">{{checkImg.name}} </h1>
          <h1>检测结果</h1>
          <span class="tip"
            >tip: 数据由
            <cite>nsfwjs</cite> 提供。判定是否为健康是个人意见</span
          >
          <span> Hentai,Porn,Sexy任意一值大于30%，则判定为不健康</span>
        </div>
        <div class="check-res">
          <el-skeleton :rows="8" animated  v-show="checkImg.isLoading"/>
          <div class="res-info" v-for="item in checkImg.predictions" v-show="checkImg.statusCode === 200">
            {{ item.className }} --- {{ item.probability }}
          </div>
          <span v-show="checkImg.statusCode === 200">{{checkImg.isHealthy ?  '健康' : '不健康'}}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 上传的图片
// 接收父组件的数据
const props = defineProps({
  checkImg: {
    type: Object,
    required: true
  }
})

// 显示遮罩层
const showImgMask = ref(true)

// 计算 .upload-itemlist 盒子的最大高度
const calculateMaxHeight = () => {
  const windowHeight = window.innerHeight
  return `${windowHeight * 0.7}px` // 占页面高度的 70%
}

</script>

<style lang="scss" scoped>
.result-area {
  .progress-box {
    margin: 10px 0;
  }

  .img-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 80%;
    padding: 10px 0;

    .left-img {
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 100%;

      .img-mask {
        height: 90%;
        width: 100%;
        filter: blur(30px); /* 调整模糊程度 */
        transition: filter 0.3s ease; /* 添加过渡效果 */
      }

      .img {
        height: 90%;
        width: 100%;
      }

      .switch-area {
        display: flex;
        align-items: center;
        height: 10%;
        margin-top: 20px;

        i {
          margin-right: 10px;
          font-size: 16px;
        }
      }
    }

    .right-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      height: 100%;
      margin-left: 10px;

      .info-header {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;

        .img-name {
          margin: 0 auto;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        h1 {
          text-align: center;
        }

        .tip {
          font-size: 14px;
          margin: 5px 0;
        }
      }

      .check-res {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 100%;


        .res-info,
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
