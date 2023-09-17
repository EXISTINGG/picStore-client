<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="isCollapse ? '0' : '200px'" class="home-aside">
        <el-row class="el-rows">
          <el-col class="el-cols">
            <div ref="folderRef" class="folderbtn">
              <i>目录</i>
              <el-button
                type="primary"
                :icon="FolderAdd"
                size="small"
                title="添加目录"
                @click="addFolderDialogVisible = true"
              />
            </div>
            <el-scrollbar :max-height="folderHeight" class="scrollbar-box">
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
      </el-aside>
      <el-container class="body-right">
        <el-header ref="headerRef" class="home-header">
          <div class="pc-header">
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              router
              :ellipsis="false"
            >
              <el-menu-item>
                <div class="header-left">
                  <div class="fold-expand">
                    <el-icon v-show="!isCollapse" @click="handleOpen" :size="28"
                      ><Fold
                    /></el-icon>
                    <el-icon v-show="isCollapse" @click="handleOpen" :size="28"
                      ><Expand
                    /></el-icon>
                  </div></div
              ></el-menu-item>
              <div class="flex-grow" />
              <!-- <el-menu-item index="0">---</el-menu-item> -->
              <el-sub-menu index="1">
                <template #title
                  ><el-icon><PictureFilled /></el-icon>图片服务</template
                >
                <el-sub-menu index="1-1">
                  <template #title
                    ><el-icon><UploadFilled /></el-icon>上传图片</template
                  >
                  <el-menu-item index="/upload">本地图片</el-menu-item>
                  <el-menu-item index="/urlupload">网络图片</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="1-2">
                  <template #title
                    ><el-icon><WarningFilled /></el-icon>图片检测</template
                  >
                  <el-menu-item index="/checkimg">本地图片</el-menu-item>
                  <el-menu-item index="/urlcheck">网络图片</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="" @click="randomImg"
                  ><el-icon><PictureFilled /></el-icon>随机一图</el-menu-item
                >
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title
                  ><el-icon><Operation /></el-icon>更多</template
                >
                <el-menu-item index="/about"
                  ><el-icon><InfoFilled /></el-icon>关于</el-menu-item
                >
                <el-menu-item index=""
                  ><el-icon><Document /></el-icon
                  ><el-link
                    href="https://apifox.com/apidoc/shared-f374e904-a169-44ee-82e6-5639683ab7db"
                    target="_blank"
                    >开放API</el-link
                  ></el-menu-item
                >
                <el-sub-menu index="2-4">
                  <template #title
                    ><el-icon><Promotion /></el-icon>开源地址</template
                  >
                  <el-menu-item index="2-4-1">前端</el-menu-item>
                  <el-menu-item index="2-4-2">后端</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
              <el-sub-menu index="3" v-if="isloginStatus">
                <template #title
                  ><el-icon><Avatar /></el-icon
                  >{{ loginStore.user.username }}</template
                >
                <el-menu-item index="/user"
                  ><el-icon><Tools /></el-icon>账户设置</el-menu-item
                >
                <el-menu-item
                  index="/admin"
                  v-if="
                    loginStore.user.power == 1 || loginStore.user.power == 2
                  "
                  ><el-icon><Cpu /></el-icon>后台管理</el-menu-item
                >
                <el-menu-item index="" @click="logOut"
                  ><el-icon><SwitchButton /></el-icon>退出登录</el-menu-item
                >
              </el-sub-menu>
              <el-menu-item index="/login" v-else
                ><el-icon><UserFilled /></el-icon>注册/登录</el-menu-item
              >
            </el-menu>
          </div>

          <div class="mobile-header">
            <header>
              <div class="header-left">
                <div class="fold-expand">
                  <el-icon v-show="!isCollapse" @click="handleOpen" :size="28"
                    ><Fold
                  /></el-icon>
                  <el-icon v-show="isCollapse" @click="handleOpen" :size="28"
                    ><Expand
                  /></el-icon>
                </div>
              </div>
              <div class="header-right">
                <div class="fold-expand">
                  <el-icon
                    v-show="!isCollapseMenu"
                    @click="handleOpenMenu"
                    :size="28"
                    ><ArrowUpBold
                  /></el-icon>
                  <el-icon
                    v-show="isCollapseMenu"
                    @click="handleOpenMenu"
                    :size="28"
                    ><ArrowDownBold
                  /></el-icon>
                </div>
              </div>
            </header>
            <div
              :style="{
                position: isCollapseMenu ? '' : 'fixed',
                display: isCollapseMenu ? 'none' : ''
              }"
              class="right-menu"
            >
              <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo"
                router
                :ellipsis="false"
              >
                <el-sub-menu index="1">
                  <template #title
                    ><el-icon><PictureFilled /></el-icon>图片服务</template
                  >
                  <el-sub-menu index="1-1">
                    <template #title
                      ><el-icon><UploadFilled /></el-icon>上传图片</template
                    >
                    <el-menu-item index="/upload">本地图片</el-menu-item>
                    <el-menu-item index="/urlupload">网络图片</el-menu-item>
                  </el-sub-menu>
                  <el-sub-menu index="1-2">
                    <template #title
                      ><el-icon><WarningFilled /></el-icon>图片检测</template
                    >
                    <el-menu-item index="/checkimg">本地图片</el-menu-item>
                    <el-menu-item index="/urlcheck">网络图片</el-menu-item>
                  </el-sub-menu>
                  <el-menu-item index="" @click="randomImg"
                    ><el-icon><PictureFilled /></el-icon>随机一图</el-menu-item
                  >
                </el-sub-menu>
                <el-sub-menu index="2">
                  <template #title
                    ><el-icon><Operation /></el-icon>更多</template
                  >
                  <el-menu-item index="/about"
                    ><el-icon><InfoFilled /></el-icon>关于</el-menu-item
                  >
                  <el-menu-item index=""
                    ><el-icon><Document /></el-icon
                    ><el-link
                      href="https://apifox.com/apidoc/shared-f374e904-a169-44ee-82e6-5639683ab7db"
                      target="_blank"
                      >开放API</el-link
                    ></el-menu-item
                  >
                  <el-sub-menu index="2-4">
                    <template #title
                      ><el-icon><Promotion /></el-icon>开源地址</template
                    >
                    <el-menu-item index="2-4-1">前端</el-menu-item>
                    <el-menu-item index="2-4-2">后端</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>
                <el-sub-menu index="3" v-if="isloginStatus">
                  <template #title
                    ><el-icon><Avatar /></el-icon
                    >{{ loginStore.user.username }}</template
                  >
                  <el-menu-item index="/user"
                    ><el-icon><Tools /></el-icon>账户设置</el-menu-item
                  >
                  <el-menu-item
                    index="/admin"
                    v-if="
                      loginStore.user.power == 1 || loginStore.user.power == 2
                    "
                    ><el-icon><Cpu /></el-icon>后台管理</el-menu-item
                  >
                  <el-menu-item index="" @click="logOut"
                    ><el-icon><SwitchButton /></el-icon>退出登录</el-menu-item
                  >
                </el-sub-menu>
                <el-menu-item index="/login" v-else
                  ><el-icon><UserFilled /></el-icon>注册/登录</el-menu-item
                >
              </el-menu>
            </div>
          </div>
        </el-header>
        <el-main class="home-main" :style="{ height: mainHeight }">
          <el-scrollbar :max-height="mainHeight">
            <!-- 删除变化需id值，后端加个id为图片名字 -->
            <Waterfall
              ref="waterfallRef"
              :list="imgList"
              :row-key="imgList.id"
              :width="300"
              :gutter="20"
              :crossOrigin="false"
              v-infinite-scroll="getMore"
              infinite-scroll-delay="500"
              infinite-scroll-distance="200"
              infinite-scroll-immediate
            >
              <template #item="{ item, url, index }">
                <div class="card">
                  <LazyImg :url="item.url" />
                  <!-- <el-image
                    class="img"
                    :title="item.imgName"
                    :src="item.url"
                    fit="contain"
                    :preview-src-list="homeStore.imgPreviewList"
                    preview-teleported
                    :initial-index="imgIndex"
                    :infinite="false"
                    @click="previewImg(index)"
                  /> -->
                  <span class="text-box">
                    <h6  :title="item.imgName">{{ item.imgName }}</h6>
                    <el-popover
                      placement="right"
                      :width="150"
                      trigger="click"
                      :disabled="popoverDisabled"
                    >
                      <!-- <el-icon><Menu /></el-icon> -->
                      <template #reference>
                        <el-icon
                          class="more"
                          @click="changeCurrentImg(item.imgName, index)"
                          ><Menu
                        /></el-icon>
                      </template>
                      <!-- 对图片的操作 -->
                      <!-- <div class="operate-img" style="display: flex; flex-direction: column; align-items: center;"> -->
                      <div class="operate-img">
                        <span @click="copyImgUrl(item.url)"
                          ><el-icon><Link /></el-icon>&nbsp; 复制链接</span
                        >
                        <span @click="renameleteImgDialog"
                          ><el-icon><Edit /></el-icon>&nbsp; 重命名图片</span
                        >
                        <span @click="openDeleteImgDialog"
                          ><el-icon><Delete /></el-icon>&nbsp; 删除图片</span
                        >
                      </div>
                    </el-popover>
                    <!-- <i class="copy" @click="copyImgUrl(item.url)">复制</i> -->
                  </span>
                </div>
              </template>
            </Waterfall>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
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
        <i
          ><el-icon><Delete /></el-icon>删除目录</i
        ><el-button
          type="danger"
          :icon="FolderDelete"
          circle
          @click="DeleteFolderDialogVisible = true"
        />
      </div>
      <div class="option option-rename">
        <i
          ><el-icon><Edit /></el-icon>重命名目录</i
        ><el-button
          type="primary"
          :icon="Edit"
          circle
          @click="renameFolderDialogVisible = true"
        />
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
  <el-dialog
    v-model="DeleteFolderDialogVisible"
    title="你正在删除目录"
    width="30%"
    align-center
  >
    <span>
      你确认要删除目录 {{ currentOperateFolder }} 吗？此操作不可逆，请三思
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DeleteFolderDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteFolderFun"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 重命名目录 -->
  <el-dialog
    v-model="renameFolderDialogVisible"
    width="30%"
    :title="'你正在重命名 ' + currentOperateFolder + ' 目录'"
    align-center
  >
    <el-form>
      <el-form-item label="新的目录名" label-width="100px">
        <el-input v-model.trim="newFolderName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="renameFolderFun"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新增目录 -->
  <el-dialog
    v-model="addFolderDialogVisible"
    width="30%"
    title="你正在新建目录"
    align-center
  >
    <el-form>
      <el-form-item label="目录名" label-width="100px">
        <el-input v-model.trim="addFolderName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFolderFun"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 删除图片 -->
  <el-dialog
    v-model="deleteImgDialogVisible"
    title="你正在删除图片"
    width="30%"
    align-center
  >
    <span>
      你确认要删除
      {{
        strLength(currentImg) > 10
          ? currentImg.substring(0, 10) + '···'
          : currentImg
      }}
      吗？
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteImgDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteImg"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 重命名图片 -->
  <el-dialog
    v-model="renameImgDialogVisible"
    width="30%"
    :title="
      '你正在重命名 ' +
      (strLength(currentImg) > 10
        ? currentImg.substring(0, 10) + '···'
        : currentImg)
    "
    align-center
  >
    <el-form>
      <el-form-item label="新的图片名" label-width="100px">
        <el-input v-model.trim="newImgName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameImgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="renameImg"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 提示信息 -->
  <el-dialog v-model="alertMessage" title="警告" width="30%" align-center>
    <span>本站仅用于演示，会定时清理数据，请勿将本站作为图床使用</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="alertMessage = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Folder from '@/components/Folder.vue'
import {
  Fold,
  Expand,
  FolderAdd,
  ArrowRight,
  FolderDelete,
  Delete,
  Edit,
  UploadFilled,
  UserFilled,
  Avatar,
  InfoFilled,
  Promotion,
  PictureFilled,
  WarningFilled,
  Tools,
  Operation,
  SwitchButton,
  Cpu,
  Document,
  Menu,
  Link,
  ArrowUpBold,
  ArrowDownBold
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useHomeStore } from '@/store/home'
import { useLoginStore } from '@/store/login'
import { useImgStore } from '@/store/image'
import { success, warning, error } from '@/utils/message'
import { getItem, setItem, removeItem } from '@/utils/localStorage'
import { strLength } from '@/utils/strLength'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const homeStore = useHomeStore()

const folderRef = ref(null)
const folderHeight = ref(0)
const headerRef = ref(null)
const mainHeight = ref(0)

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

// 切换目录
const currentIdx = async (index) => {
  if(index === homeStore.currentFolder) return
  // vue-waterfall-plugin-next插件会缓存图片链接，导致切换目录时会存在之前目录的图片，故清空
  imgList.value = []
  homeStore.currentFolder = index
  await homeStore.getImgList(index, 40, true, true)
  imgList.value = homeStore.imgList
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
  if (newFolderName.value === '') return warning('请输入有效字符')
  if (newFolderName.value === currentOperateFolder.value)
    return warning('与旧目录名相同')
  // alert(newFolderName.value)
  homeStore.renameFolderFun(currentOperateFolder.value, newFolderName.value)
  newFolderName.value = ''
  renameFolderDialogVisible.value = false
  OperateFolderDialogVisible.value = false
}

// 新建目录
const addFolderFun = () => {
  if (addFolderName.value === '') return warning('请输入有效字符')
  homeStore.addFolderFun(addFolderName.value).then(() => {
    addFolderName.value = ''
    addFolderDialogVisible.value = false
  })
}

// 是否 折叠面板
const isCollapse = ref(false)
// 是否 折叠菜单面板
const isCollapseMenu = ref(true)

// 打开关闭折叠面板
const handleOpen = () => {
  // 如果在isCollapse关闭的时候要打开isCollapse，isCollapseMenu是开启的情况(false为开启情况),则关闭isCollapseMenu
  if (isCollapseMenu.value === false && isCollapse.value === true) {
    isCollapseMenu.value = true
  }
  isCollapse.value = !isCollapse.value
}
// 打开关闭折叠菜单面板
const handleOpenMenu = () => {
  // 如果在isCollapseMenu关闭的时候要打开isCollapseMenu，isCollapse是开启的情况(false为开启情况),则关闭isCollapse
  if (isCollapseMenu.value === true && isCollapse.value === false) {
    isCollapse.value = true
  }
  isCollapseMenu.value = !isCollapseMenu.value
}

const loginStore = useLoginStore()

const activeIndex = ref('1')

const randomImgUrl = ref('')

// 是否是登录状态
const isloginStatus = ref(false)
// 获取token和user,如果为空,就判定为没登陆
const loginStatus = () => {
  if (getItem('TOKEN') != '' && getItem('user') != '') {
    return (isloginStatus.value = true)
  } else {
    isloginStatus.value = false
  }
}
// 页面挂载准备好时,调用函数检查登录状态
loginStatus()

// 退出登录
const logOut = () => {
  loginStore.logOutFun().then(() => {
    // 退出登陆后,检查登录状态
    loginStatus()
  })
}

const randomImg = async () => {
  const { data } = await axios.get(
    'https://picapi.hxq-001.top/file/api/randomimg'
  )
  if (data.status !== 200) return warning(data.message)
  window.open(data.url)
}

const imgStore = useImgStore()
// 需要渲染的图片
const imgList = ref([])
// 图片索引
const imgIndex = ref(0)
// 现操作的图片
const currentImg = ref('')
// 现操作的图片的索引
const currentImgIdx = ref(0)
// 对图片的操作 是否可用
const popoverDisabled = ref(false)
// 删除图片询问框
const deleteImgDialogVisible = ref(false)

const waterfallRef = ref(null)

// 现在选择的图片的name,index
const changeCurrentImg = (name, i) => {
  currentImg.value = name
  currentImgIdx.value = i
}
// 打开删除图片询问框
const openDeleteImgDialog = () => {
  deleteImgDialogVisible.value = true
  popoverDisabledFun()
}
// 重命名图片询问框
const renameImgDialogVisible = ref(false)
// 打开重命名图片询问框
const renameleteImgDialog = () => {
  renameImgDialogVisible.value = true
  newImgName.value = ''
  popoverDisabledFun()
}
// 新的图片名
const newImgName = ref('')

// 获取更多图片
const getMore = () => {
  homeStore.getImgList(homeStore.currentFolder, 20)
}
// 预览图片
const previewImg = (i) => (imgIndex.value = i)

let timer
// 隐藏对图片的操作(关闭功能后立马启用,为了隐藏Popover)
const popoverDisabledFun = () => {
  clearTimeout(timer)
  popoverDisabled.value = true
  timer = setTimeout(() => {
    popoverDisabled.value = false
  }, 500)
}

// 复制图片链接
const copyImgUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    success('复制成功')
    popoverDisabledFun()
  } catch (err) {
    error('复制失败')
    popoverDisabledFun()
  }
}
// 删除图片
const deleteImg = () => {
  imgStore.deleteImgFun(homeStore.currentFolder, currentImg.value).then(() => {
    if (imgStore.isDelete) {
      // 关闭
      deleteImgDialogVisible.value = false
      // 从列表移除图片
      imgList.value.splice(currentImgIdx.value, 1)
      // 清空
      homeStore.imgList = []
      // 刷新
      homeStore.getImgList(homeStore.currentFolder, 40, true)
      // 重新渲染图片
      // waterfallRef.value.renderer()
      // 重置数据
      imgStore.isDelete = false
    }
  })
}
// 重命名图片
const renameImg = () => {
  // console.log(currentImg.value, newImgName.value, homeStore.currentFolder)
  if (newImgName.value === '') return warning('请输入有效字符')
  imgStore
    .renameImgFun(homeStore.currentFolder, currentImg.value, newImgName.value)
    .then(() => {
      if (imgStore.isRename) {
        // 关闭
        renameImgDialogVisible.value = false
        // 清空
        homeStore.imgList = []
        // 没有重新渲染，清空列表
        imgList.value = []
        // 刷新
        homeStore.getImgList(homeStore.currentFolder, 40, true)
        // 重新赋予列表
        imgList.value = homeStore.imgList
        // imgList.value.filter((item,i) => {
        //   return currentImgIdx.value === i
        // }).imgName = newImgName.value
        // 重置数据
        imgStore.isRename = false
      }
    })
}

// 提示信息，仅使用一次
const alertMessage = ref(false)
// 在页面加载时检查sessionStorage中的标志
const storedalertMessage = sessionStorage.getItem('alertMessage')
if (storedalertMessage !== 'true') {
  // 如果标志不为true，则提示
  alertMessage.value = true
}
// 弹出过提示信息
sessionStorage.setItem('alertMessage', 'true')

onMounted(async () => {
  folderHeight.value = window.innerHeight - folderRef.value.offsetHeight
  mainHeight.value = window.innerHeight - headerRef.value.offsetHeight
  await homeStore.getFolderList()
  await homeStore.getImgList(homeStore.firstFolder, 40, true, true)
  imgList.value = homeStore.imgList
  homeStore.currentFolder = homeStore.firstFolder
})
</script>

<style lang="scss">
$main-bg: #409eff;
.el-dialog__header {
  overflow: hidden
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-aside {
  height: 100vh;
  overflow: hidden;
  // box-sizing: border-box;
}

.el-rows {
  width: 100%;
  // height: 100%;

  .folderbtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;

    i {
      padding: 10px;
      font-size: 16px;
    }
  }
}

.scrollbar-box {
  // width: 100%;
}

.menus {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // overflow-y: auto;
  // height: 960px;
  // height: 100%;
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
      display: block;
      width: 100%;
      font-size: 16px;
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

.operate-select {
  display: flex;
  flex-direction: column;

  .option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 0.5px solid #666;
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

.body-right {
}

.home-header {
  // height: 10vh;
  .flex-grow {
    flex-grow: 1;
  }
}

.home-main {

  img {
    transition: transform 0.5s ease;
  }

  img:hover {
    transform: scale(1.2);
  }
  
  .text-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 10px;

    h6 {
      flex: 0.8;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .more {
      flex: 0.2;
      color: $main-bg;
      font-size: 16px;
      text-align: right;
      cursor: pointer;
    }
  }
}

// 修改菜单默认宽度
.el-menu--popup {
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: center;
  min-width: 100px;
}

.operate-img {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;

  span {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    width: 100%;
  }

  span:hover {
    background: $main-bg;
    color: #000;
  }
}

.lazy__img[lazy='loading'] {
  padding: 5em 0;
  width: 48px;
}

.lazy__img[lazy='loaded'] {
  width: 100%;
}

.lazy__img[lazy='error'] {
  padding: 5em 0;
  width: 48px;
}

.mobile-header {
  display: none;
}

@media (max-width: 768px) {
  .common-layout {
    box-sizing: border-box;
  }

  .pc-header {
    display: none;
    z-index: 999;
  }

  .mobile-header {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 999;

    header {
      box-sizing: border-box;
      padding: 0 20px;
      height: 60px;
      width: 100%;
      position: fixed;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: #666 0.5px solid;
      z-index: 999;
      backdrop-filter: saturate(200%) blur(40px);
    }

    .right-menu {
      width: 100%;
      top: 60px;
      right: 0;
      z-index: 999;
    }
  }
  // 修改弹窗宽度
  .el-dialog {
    width: 80%;
  }
  // 修改头部padding
  .el-header {
    --el-header-padding: 0;
  }
  // 修改main区域的padding为0，否则滑动时main出区域
  .el-main {
    padding: 0;
  }
}
</style>
