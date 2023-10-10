<template>
  <div class="system-box">
    <!-- 统计 -->
    <div class="statistic-area">
      <el-row class="statistic-box">
        <el-col :span="6" class="statistic-item">
          <el-statistic title="系统当前使用" :value="storageType == 0 ? '本机' : '第三方'">
            <template #prefix>
              <el-icon style="vertical-align: -0.125em">
                <Coin  />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6" class="statistic-item">
          <el-statistic title="相册数量" :value="adminStore.systemConfig.num_albums">
            <template #prefix>
              <el-icon style="vertical-align: -0.125em">
                <PictureFilled  />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6" class="statistic-item">
          <el-statistic title="图片数量" :value="adminStore.systemConfig.num_images">
            <template #prefix>
              <el-icon style="vertical-align: -0.125em">
                <Picture  />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6" class="statistic-item">
          <el-statistic title="用户数量" :value="adminStore.systemConfig.num_users">
            <template #prefix>
              <el-icon style="vertical-align: -0.125em">
                <User  />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <!-- 表单 -->
    <div class="from-area">
      <el-form
        ref="formRef"
        :model="diskForm"
        label-width="200px"
        class="demo-ruleForm"
        :rules="rules"
        label-position="top"
      > 
      <el-tooltip
        effect="dark"
        content="单位: B, 例:1,000,000B等于1MB"
        placement="top"
      >
        <el-form-item
          :label="`本机磁盘容量 ${diskForm.localDisk > 0 ? convertFileSize(diskForm.localDisk) : ''}`"
          prop="localDisk"
        >
          <el-input
            v-model.number="diskForm.localDisk"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
      </el-tooltip>

      <el-tooltip
        effect="dark"
        content="单位: B, 例:1,000,000B等于1MB"
        placement="top"
      >
        <el-form-item
          :label="`云存储磁盘容量 ${diskForm.cloudDisk > 0 ? convertFileSize(diskForm.cloudDisk) : ''}`"
          prop="cloudDisk"
        >
          <el-input
            v-model.number="diskForm.cloudDisk"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
      </el-tooltip>
      </el-form>

      <div class="btn-area">
        <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
      </div>
    </div>

    <!-- 卡片 -->
    <div class="card-area">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>本机(服务器存储)<el-tag type="success" class="current-tag" effect="dark" round v-if="storageType == 0">当前</el-tag></span>
            <el-button :disabled="storageType == 0" @click="changeSystemConfig('0')">启用服务器存储</el-button>
          </div>
        </template>
        <div class="content-box">
          <div class="left-detail">
            <span>磁盘容量: {{convertFileSize(adminStore.systemConfig.local_disk_capacity)}}</span>
            <span>已使用容量: {{ convertFileSize(adminStore.systemConfig.local_disk_usage) }}</span>
          </div>

          <div class="right-progress">
            <el-progress type="dashboard" :percentage="(Number(adminStore.systemConfig.local_disk_usage) / Number(adminStore.systemConfig.local_disk_capacity) * 100)">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage.toFixed(2)}}%</span>
                <span class="percentage-label">已使用</span>
              </template>
            </el-progress>
          </div>
        </div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>第三方(backblazeb云存储)<el-tag class="current-tag" type="success" effect="dark" round v-if="storageType == 1">当前</el-tag></span>
            <el-button :disabled="storageType == 1" @click="changeSystemConfig('1')">启用云存储</el-button>
          </div>
        </template>
        <div class="content-box">
          <div class="left-detail">
            <span>磁盘容量: {{ convertFileSize(adminStore.systemConfig.cloud_disk_capacity) }}</span>
            <span>已使用容量: {{ convertFileSize(adminStore.systemConfig.cloud_disk_usage) }}</span>
          </div>

          <div class="right-progress">
            <el-progress type="dashboard" :percentage="(Number(adminStore.systemConfig.cloud_disk_usage) / Number(adminStore.systemConfig.cloud_disk_capacity) * 100)">
              <template #default="{ percentage }">
                <span class="percentage-value">{{  percentage.toFixed(2) }}%</span>
                <span class="percentage-label">已使用</span>
              </template>
            </el-progress>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {useAdminStore} from '@/store/admin'
import {convertFileSize} from '@/utils/convert'
import {
  Coin,
  PictureFilled,
  Picture,
  User
} from '@element-plus/icons-vue'
import {success,warning,error} from '@/utils/message'


const formRef = ref(null)

const diskForm = reactive({
  localDisk: '',
  cloudDisk: '',
})

// 验证规则
const rules = reactive({
  localDisk: [
  { type: 'number', message: '必须为数字' },
  ],
  cloudDisk: [
  { type: 'number', message: '必须为数字' },
  ],
})

const adminStore = useAdminStore();
// 当前系统使用存储类型
const storageType = ref(0);

// 获取系统配置
const getSystemConfig = async () => {
  await adminStore.getSystemConfigFun();
  storageType.value = adminStore.systemConfig.storage_type
}

// 更改系统配置
const changeSystemConfig = async (storage_type, cloud_disk_capacity, local_disk_capacity) => {
  
  await adminStore.changeSystemFun(storage_type, cloud_disk_capacity, local_disk_capacity);
  if(adminStore.ischangeSystem) {
    getSystemConfig()
  }
}

// 提交表单
const submitForm = async (formEl) => {
  if (!formEl) return ;

  let cloudDisk = diskForm.cloudDisk
  let localDisk = diskForm.localDisk

  // 如果任意一值小于0或两个值都为空，弹出提示
  if(cloudDisk < 0 || localDisk < 0 || (!cloudDisk && !localDisk)) return warning('请正确的填写信息');
  
  // 没有填写的则用原来的数据
  if(!diskForm.cloudDisk) {
    cloudDisk = adminStore.systemConfig.cloud_disk_capacity;
  } else if(!diskForm.localDisk) {
    localDisk = adminStore.systemConfig.local_disk_capacity;
  }
  
  await formEl.validate(async (valid, fields) => {
    // 校验通过
    if (valid) {
      await adminStore.changeSystemFun(undefined , String(cloudDisk), String(localDisk))
        if(adminStore.ischangeSystem) {

          getSystemConfig()

          // 清空信息
          formEl.resetFields()
        }
    } else {
      warning('请输入相关信息')
    }
  })
}

onMounted(() => {
  getSystemConfig()
})
</script>

<style lang="scss" scoped>
.statistic-area {
  width: 99%;
  height: 150px;
  box-shadow: 0 0 0.32rem rgba(0, 0, 0, 0.12);
  border: .5px solid #e4e7ed;
  background: url("../../../assets/bg/admin-bg.png") no-repeat right top;
  

  .statistic-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(1px);

    .statistic-item {
      display: flex;
      // flex-direction: column;
      justify-content: space-around;
      align-items: center;
      text-align: center;
      width: 100px;
      height: 100px;
    }
  }
  // padding: 20px 0;
}

.from-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 20px 0;
  padding: 20px;
  height: 100px;
  // box-shadow: 0 0 0.32rem rgba(0, 0, 0, 0.12);

  .demo-ruleForm {
    @extend .from-area;
    box-shadow: 0 0 0.32rem rgba(0, 0, 0, 0.12);
    width: 99%;
  }

  .btn-area {
    position: absolute;
    bottom: 20px;
    right: 50px;
  }
}

.card-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 30px
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.box-card {
  display: flex;
  flex-direction: column;
  height: 220px;
  width: 480px;
  margin: 20px;

  .current-tag {
    margin-left: 5px;
  }


  .content-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;


    .left-detail {
      display: flex;
      flex-direction: column;
      justify-content: center;
      // width: 200px;
      height: 100%;


      span {
        font-size: 14px;
        margin: 5px 0;
      }
    }

    .right-progress {
      // width: 200px;
      height: 100%;

      .percentage-value {
        display: block;
        margin-top: 10px;
        font-size: 20px;
      }
      .percentage-label {
        display: block;
        margin-top: 10px;
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 768px) {
  .statistic-area {
    height: 400px;

    .statistic-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

  }

  .from-area {
    display: flex;
    flex-direction: column;
    margin: 20px 0;
    padding: 20px;
    height: 350px;

  .demo-ruleForm {
    @extend .from-area;
  }

  .btn-area {
    bottom: 50px;
  }
}

  .box-card  {
    height: 350px;
    justify-content: space-between;

    .current-tag {
      margin-top: 5px;
    }

    .content-box {
      flex-direction: column;

    }
  }
}
</style>
