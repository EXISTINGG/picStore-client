<template>
  <div class="left-menu" :style="{ top: homeStore.topMenuH + 'px' }">
    <el-row class="el-rows">
      <el-col class="el-cols">
        <div class="folderbtn">
          <h1 ref="folderRef">目录</h1>
          <el-button
            type="primary"
            :icon="FolderAdd"
            size="small"
            title="添加目录"
            @click="addFolderDialogVisible = true"
          />
        </div>
        <el-scrollbar :max-height="folderHeight - homeStore.homeH">
          <el-menu
            :default-active="homeStore.firstFolder"
            class="menus"
            @select="currentIdx"
          >
            <el-menu-item
              :index="item"
              class="meun-item"
              v-for="(item, i) in homeStore.folderList"
            >
              <span :title="item">
                {{ item }}
                <el-icon class="icon" @click.stop="operateFolder(item)"
                  ><ArrowRight
                /></el-icon>
              </span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
<!-- 目录操作 -->
  <el-dialog
    v-model="OperateFolderDialogVisible"
    :title="'请选择你要对 ' + currentOperateFolder + ' 目录进行的操作'"
    width="40%"
    draggable
    align-center
  >
    <section class="operate-select">
      <div class="option option-delete">
        <i><el-icon><Delete /></el-icon>删除目录</i><el-button type="danger" :icon="FolderDelete" circle @click="DeleteFolderDialogVisible = true"/>
      </div>
      <div class="option option-rename">
        <i><el-icon><Edit /></el-icon>重命名目录</i><el-button type="primary" :icon="Edit" circle @click="renameFolderDialogVisible = true"/>
      </div>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="OperateFolderDialogVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="OperateFolderDialogVisible = false">
          确认
        </el-button> -->
      </span>
    </template>
  </el-dialog>

<!-- 删除目录 -->
 <el-dialog v-model="DeleteFolderDialogVisible" title="你正在删除目录" width="30%" align-center>
    <span>
      你确认要删除目录 {{currentOperateFolder}} 吗？此操作不可逆，请三思
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DeleteFolderDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteFolderFun">
          删除
        </el-button>
      </span>
    </template>
  </el-dialog>

<!-- 重命名目录 -->
  <el-dialog v-model="renameFolderDialogVisible" width="30%" :title="'你正在重命名 '+currentOperateFolder+' 目录'" align-center>
    <el-form>
      <el-form-item label="新的目录名" label-width="100px">
        <el-input v-model.trim="newFolderName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="renameFolderFun">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

<!-- 新增目录 -->
  <el-dialog v-model="addFolderDialogVisible" width="30%" title="你正在新建目录" align-center>
    <el-form>
      <el-form-item label="目录名" label-width="100px">
        <el-input v-model.trim="addFolderName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFolderFun">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FolderAdd, ArrowRight, FolderDelete, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useHomeStore } from '@/store/home'
import {warning} from '@/utils/message'

const homeStore = useHomeStore()

const folderRef = ref(null)
const folderHeight = ref(0)
// 是否显示对话框(操作目录)
const OperateFolderDialogVisible = ref(false)
// 正在操作的目录
const currentOperateFolder = ref('')
// 是否显示对话框(删除目录)
const DeleteFolderDialogVisible = ref(false)
// 是否显示对话框(重命名目录)
const renameFolderDialogVisible = ref(false)
// 重命名的目录名
const newFolderName = ref('')
// 是否显示对话框(新增目录)
const addFolderDialogVisible = ref(false)
// 新增目录名
const addFolderName = ref('')

const getFolderHeight = () => (folderHeight.value = window.innerHeight)

const currentIdx = (index) => {
  // imgStore.ImgList = []
  console.log(index)
  homeStore.currentFolder = index
  homeStore.getImgList(index, 40, true, true)
}

// 操作目录
const operateFolder = (folder) => {
  OperateFolderDialogVisible.value = true
  currentOperateFolder.value = folder
  // 清空newFolderName
  newFolderName.value = ''
}

// 确认删除目录
const deleteFolderFun = () => {
  homeStore.deleteFolderFun(currentOperateFolder.value)
  DeleteFolderDialogVisible.value = false
  OperateFolderDialogVisible.value = false
}

// 确认重命名目录
const renameFolderFun = () => {
  if(newFolderName.value === '') return warning('请输入有效字符')
  if(newFolderName.value === currentOperateFolder.value) return warning('与旧目录名相同')
  // alert(newFolderName.value)
  homeStore.renameFolderFun(currentOperateFolder.value,newFolderName.value)
  newFolderName.value = ''
  renameFolderDialogVisible.value = false
  OperateFolderDialogVisible.value = false
}

// 新建目录
const addFolderFun = () => {
  if(addFolderName.value === '') return warning('请输入有效字符')
  homeStore.addFolderFun(addFolderName.value).then(() => {
    addFolderName.value = ''
    addFolderDialogVisible.value = false
  })
}

onMounted(() => {
  getFolderHeight()
  homeStore.h1H = folderRef.value.offsetHeight
  homeStore.folderHeight = folderHeight.value
})
</script>

<style lang="scss" scoped>
.left-menu {
  display: flex;
  flex-direction: column;
  width: 150px;
  position: fixed;
  // top: 60px; /* 距离顶部的位置 */
  // height: 100%;

  .el-rows {
    width: 100%;
    height: 100%;

    .folderbtn {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h1 {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      // width: 100%;
      font-size: 16px;
    }
  }

  .el-cols {
    width: 100%;

    .menus {
      display: flex;
      flex-direction: column;
      justify-content: center;
      // overflow-y: auto;
      // height: 960px;
      height: 100%;
      width: 100%;
      // background: yellow;

      // align-items: center;
      // width: 100%;
      // position: fixed; /* 固定定位 */
      // left: 0; /* 距离左侧的位置 */
      // width: 200px; /* 区域宽度 */
      // height: 100vh; /* 区域高度 */
      // overflow-y: scroll; /* 垂直滚动条 */

      .meun-item {
        // display: flex;
        // align-items: center;
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        // background: pink;

        span {
          // position: relative;
          display: inline-block;
          width: 90%;
          // height: 100%;
          // line-height: 100%;
          // display: flex;
          // align-items: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          // background: skyblue;

          .icon {
            position: absolute;
            right: 0;
            top: 27%;
            // width: 20px;
            // height: 20px;
            // line-height: 100%;
            // background: green;
          }
        }
      }
    }
  }
}

.operate-select {
  display: flex;
  flex-direction: column;

  .option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: .5px solid #666;
    font-size: 16px;
    color: #000;

    i {
      display: flex;
      align-items: center;
    }
  }

  .option-delete:hover {
    background: #f89898;
  }
  .option-rename:hover {
    background: #79bbff;
  }
}
</style>
