<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="isCollapse ? '0' : '200px'" class="home-aside">
        <el-row class="el-rows">
          <el-col class="el-cols">
            <div ref="albumRef" class="albumbtn">
              <i>相册</i>
              <el-button
                type="primary"
                :icon="Picture"
                size="small"
                title="新建相册"
                @click="addAlbumDialogVisible = true"
              />
            </div>
            <el-scrollbar :max-height="albumHeight" class="scrollbar-box">
              <!-- 由于index是对象,所以default-active只能获取数组第一个对象 -->
              <el-menu
                :default-active="defaultAlbum"
                class="menus"
                @select="currentIdx"
              >
                <el-menu-item
                class="meun-item"
                v-for="(item, i) in homeStore.albumList"
                :index="JSON.stringify(item)"
                >
                  <span :title="item.name">
                    {{ item.name }}
                    <el-icon class="icon" @click.stop="operateAlbum(item, item.name, item.id, item.privacy)"
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
                <el-menu-item index="/log"><el-icon><Histogram /></el-icon>更新日志</el-menu-item>
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
                  <el-menu-item index="">
                      <el-link href="https://github.com/EXISTINGG/picStore-client" target="_blank">前端</el-link>
                    </el-menu-item>
                    <el-menu-item index="">
                      <el-link href="https://github.com/EXISTINGG/PicStore" target="_blank">后端</el-link>
                    </el-menu-item>
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
                    loginStore.user.permissions == 1 || loginStore.user.permissions == 2
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
                unique-opened
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
                  <el-menu-item index="/about"><el-icon><InfoFilled /></el-icon>关于</el-menu-item>
                  <el-menu-item index="/log"><el-icon><Histogram /></el-icon>更新日志</el-menu-item>
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
                    <el-menu-item index="">
                      <el-link href="https://github.com/EXISTINGG/picStore-client" target="_blank">前端</el-link>
                    </el-menu-item>
                    <el-menu-item index="">
                      <el-link href="https://github.com/EXISTINGG/PicStore" target="_blank">后端</el-link>
                    </el-menu-item>
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
                      loginStore.user.permissions == 1 || loginStore.user.permissions == 2
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
              v-show="imgList.length !== 0"
            >
              <template #item="{ item, url, index }">
                <div class="card">
                  <LazyImg style="cursor: pointer;" :url="item.file_url" @click="goImgDetailPage(item)"/>
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
                    <h6  :title="item.name">{{ item.name }}</h6>
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
                          @click="changeCurrentImg(item.id, item.name, index)"
                          ><Menu
                        /></el-icon>
                      </template>
                      <!-- 对图片的操作 -->
                      <!-- <div class="operate-img" style="display: flex; flex-direction: column; align-items: center;"> -->
                      <div class="operate-img">
                        <span @click="copyImgUrl(item.file_url)"
                          ><el-icon><Link /></el-icon>&nbsp; 复制链接</span
                        >
                        <span @click="goImgDetailPage(item)">
                            <el-icon><Edit /></el-icon>&nbsp; 图片信息
                        </span>
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

            <!-- 空页面 -->
            <template v-if="imgList.length === 0">
              <el-empty
                description="暂无图片"
                style="width: 100vw; height: 100vh; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"
              />
            </template>

          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>

  <!-- 相册操作 -->
  <el-dialog
    v-model="OperateAlbumDialogVisible"
    :title="'请选择你要对 ' + currentOperateAlbum + ' 相册进行的操作'"
    width="40%"
    draggable
    align-center
  >
    <section class="operate-select">
      <div class="option option-delete">
        <i
          ><el-icon><Delete /></el-icon>删除相册</i
        ><el-button
          type="danger"
          :icon="Delete"
          circle
          @click="DeleteAlbumDialogVisible = true"
        />
      </div>
      <div class="option option-rename">
        <i
          ><el-icon><Edit /></el-icon>更新相册</i
        ><el-button
          type="primary"
          :icon="Edit"
          circle
          @click="renameAlbumDialogVisible = true"
        />
      </div>
      <div class="option option-detail">
        <i
          ><el-icon><Postcard /></el-icon>相册信息</i
        ><el-button
          type="success"
          :icon="Postcard"
          circle
          @click="albumDetailDialogVisible = true"
        />
      </div>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="OperateAlbumDialogVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="OperateAlbumDialogVisible = false">
          确认
        </el-button> -->
      </span>
    </template>
  </el-dialog>

  <!-- 删除相册 -->
  <el-dialog
    v-model="DeleteAlbumDialogVisible"
    title="你正在删除相册"
    width="30%"
    align-center
  >
    <span>
      你确认要删除相册 {{ currentOperateAlbum }} 吗？此操作不可逆，请三思
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DeleteAlbumDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteAlbumFun"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 重命名相册 -->
  <el-dialog
    v-model="renameAlbumDialogVisible"
    width="30%"
    :title="'你正在更新 ' + currentOperateAlbum + ' 相册'"
    align-center
  >
    <el-form label-position="top">
      <el-form-item label="新的相册名" label-width="100px">
        <el-input v-model.trim="updateAlbum.newName" autocomplete="off" />
      </el-form-item>

      <el-form-item label="相册私密性">
      <el-radio-group v-model="updateAlbum.newPrivacy">
        <el-radio label="公共" />
        <el-radio label="私人" />
      </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameAlbumDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateAlbumFun"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新增相册 -->
  <el-dialog
    v-model="addAlbumDialogVisible"
    width="30%"
    title="你正在新建相册"
    align-center
  >
    <el-form label-position="top">
      <el-form-item label="相册名" label-width="100px">
        <el-input v-model.trim="addAlbumName.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="相册私密性">
      <el-radio-group v-model="addAlbumName.privacy">
        <el-radio label="公共" />
        <el-radio label="私人" />
      </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addAlbumDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAlbumFun"> 确认 </el-button>
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
  <!-- <el-dialog
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
  </el-dialog> -->

  <!-- 相册详情信息 -->
  <el-dialog
    v-model="albumDetailDialogVisible"
    width="30%"
    title="相册详情信息"
    align-center
  > 
  <el-descriptions :title="currentOperateAlbum" border direction="vertical" size="small" column="1">
    <el-descriptions-item label="相册所属">{{currentAlbum.creator}}</el-descriptions-item>
    <el-descriptions-item label="相册图片数">{{ currentAlbum.file_count }}</el-descriptions-item>
    <el-descriptions-item label="隐私性">{{ currentAlbum.privacy == 0 ? '公共' : '私人' }}</el-descriptions-item>
    <el-descriptions-item label="存储类型">{{ currentAlbum.storage_location == 0 ? '服务器' : '云存储' }}</el-descriptions-item>   
  </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="albumDetailDialogVisible = false"> 确认 </el-button>
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
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import {
  Fold,
  Expand,
  Picture,
  ArrowRight,
  Delete,
  Edit,
  UploadFilled,
  UserFilled,
  Avatar,
  InfoFilled,
  Histogram,
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
  ArrowDownBold,
  Postcard
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
const router = useRouter()

const albumRef = ref(null)
const albumHeight = ref(0)
const headerRef = ref(null)
const mainHeight = ref(0)

// 默认打开的相册
const defaultAlbum = ref('')
// 是否显示对话框(操作相册)
const OperateAlbumDialogVisible = ref(false)
// 正在操作的相册
const currentOperateAlbum = ref('')
// 正在操作的相册id
const currentOperateAlbumId = ref('')
// 是否显示对话框(删除相册)
const DeleteAlbumDialogVisible = ref(false)
// 是否显示对话框(重命名相册)
const renameAlbumDialogVisible = ref(false)
// 是否显示对话框(相册详情信息)
const albumDetailDialogVisible = ref(false)
// 当前操作的相册
const currentAlbum = ref({})
// 更新的相册信息
const updateAlbum = reactive({
  newName: '',
  newPrivacy: '',
})
// 是否显示对话框(新增相册)
const addAlbumDialogVisible = ref(false)
// 新增相册名
const addAlbumName = ref({
  name: '',
  privacy: ''
})

// 切换相册
const currentIdx = async (album) => {
  // 切换相册接受的参数是由el-menu-item的index决定,而这里的需要id和name,
  // 所以,index必须使用转化为字符的对象,这里必须转化为对象使用
  const {id, name} = JSON.parse(album);
  if(name === homeStore.currentAlbum) return

  // vue-waterfall-plugin-next插件会缓存图片链接，导致切换相册时会存在之前相册的图片，故清空

  imgList.value = []

  homeStore.currentAlbumId = id
  homeStore.currentAlbum = name
  await homeStore.getImgList(id, name, true)
  imgList.value = homeStore.imgList
}

// 操作相册
const operateAlbum = (item, album, id, privacy) => {
  currentAlbum.value = item
  OperateAlbumDialogVisible.value = true
  currentOperateAlbum.value = album
  currentOperateAlbumId.value = id

  // 替换updateAlbum的值,用于更新相册信息
  updateAlbum.newName = album
  updateAlbum.newPrivacy = privacy == 0 ? '公共' : '私人';
}

// 确认删除相册
const deleteAlbumFun = async () => {
  
  await homeStore.deleteAlbumFun(currentOperateAlbumId.value,currentOperateAlbum.value)

  if(homeStore.isDelAlbum) {
    // window.location.reload();
    await initHome()
  }

  DeleteAlbumDialogVisible.value = false
  OperateAlbumDialogVisible.value = false
}

// 确认更新相册信息
const updateAlbumFun = () => {
  // newName, newPrivacy必须有一个
  if (updateAlbum.newName === '' && updateAlbum.newPrivacy === '') return warning('请至少选择一个更新')

  if (updateAlbum.newName === '') return warning('请输入有效字符');

  const privacy = updateAlbum.newPrivacy === '公共' ? 0 : 1;

  // if (updateAlbum.newName === currentOperateAlbum.value) return warning('与旧相册名相同');
  // 如果旧相册名与新相册名不相同，说明更改了相册名，需要更新相册名
  if (updateAlbum.newName !== currentOperateAlbum.value) {
    homeStore.updateAlbumFun(currentOperateAlbumId.value, currentOperateAlbum.value, updateAlbum.newName, privacy)
  } else {
    // 未更改相册名,相册名为空
    homeStore.updateAlbumFun(currentOperateAlbumId.value, currentOperateAlbum.value, '', privacy)
  }

  updateAlbum.newName = ''
  updateAlbum.newPrivacy = ''

  renameAlbumDialogVisible.value = false
  OperateAlbumDialogVisible.value = false
}

// 新建相册
const addAlbumFun = () => {
  if (addAlbumName.value.name === '') return warning('请输入有效字符');
  if(addAlbumName.value.privacy === '') return warning('请选择相册私密性');

  const privacy = addAlbumName.value.privacy === '公共' ? 0 : 1

  homeStore.addAlbumFun(addAlbumName.value.name, privacy).then(() => {
    addAlbumName.value.name = ''
    addAlbumName.value.privacy = ''
    addAlbumDialogVisible.value = false
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
    'https://picapi.hxq-001.top/image/api/randomimgurl'
    // 'http://127.0.0.1/image/api/randomimgurl',
  )
  if (data.status !== 200) return warning(data.message)
  window.open(data.data)
}

const imgStore = useImgStore()
// 需要渲染的图片
const imgList = ref([])
// 图片索引
const imgIndex = ref(0)
// 现操作的图片
const currentImg = ref('')
// 现操作的图片id
const currentImgId = ref('')
// 现操作的图片的索引
const currentImgIdx = ref(0)
// 对图片的操作 是否可用
const popoverDisabled = ref(false)
// 删除图片询问框
const deleteImgDialogVisible = ref(false)

const waterfallRef = ref(null)

// 现在选择的图片的name,index
const changeCurrentImg = (id, name, i) => {
  currentImgId.value= id;
  currentImg.value = name
  currentImgIdx.value = i
}
// 打开删除图片询问框
const openDeleteImgDialog = () => {
  deleteImgDialogVisible.value = true
  popoverDisabledFun()
}

//#region 
// 重命名图片询问框
// const renameImgDialogVisible = ref(false)
// 打开重命名图片询问框
// const renameleteImgDialog = () => {
//   renameImgDialogVisible.value = true
//   newImgName.value = ''
//   popoverDisabledFun()
// }
//#endregion

// 新的图片名
// const newImgName = ref('')

// 获取更多图片
const getMore = () => {
  homeStore.getImgList(homeStore.currentAlbumId, homeStore.currentAlbum, false, homeStore.offset)
}
// 预览图片
// const previewImg = (i) => (imgIndex.value = i)

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

// 去往图片详情页
const goImgDetailPage = (item) => {
  // 图片详情信息,用于详情页使用
  setItem('imgDetail',item);

  router.push('/imgdetail');
}

// 删除图片
const deleteImg = () => {
  imgStore.deleteImgFun(currentImgId.value,currentImg.value).then(() => {
    if (imgStore.isDelete) {
      // 关闭
      deleteImgDialogVisible.value = false
      // 从列表移除图片
      imgList.value.splice(currentImgIdx.value, 1)
      // 清空
      homeStore.imgList = []
      // 刷新
      homeStore.getImgList(homeStore.currentAlbumId, homeStore.currentAlbum)
      // 重新渲染图片
      // waterfallRef.value.renderer()
      // 重置数据
      imgStore.isDelete = false
    }
  })
}

//#region 
// 重命名图片(废弃)
// const renameImg = () => {
//   // console.log(currentImg.value, newImgName.value, homeStore.currentAlbum)
//   if (newImgName.value === '') return warning('请输入有效字符')
//   imgStore
//     .renameImgFun(homeStore.currentAlbum, currentImg.value, newImgName.value)
//     .then(() => {
//       if (imgStore.isRename) {
//         // 关闭
//         renameImgDialogVisible.value = false
//         // 清空
//         homeStore.imgList = []
//         // 没有重新渲染，清空列表
//         imgList.value = []
//         // 刷新
//         homeStore.getImgList(homeStore.currentAlbumId, homeStore.currentAlbum)
//         // 重新赋予列表
//         imgList.value = homeStore.imgList
//         // imgList.value.filter((item,i) => {
//         //   return currentImgIdx.value === i
//         // }).imgName = newImgName.value
//         // 重置数据
//         imgStore.isRename = false
//       }
//     })
// }
//#endregion

// 提示信息，仅使用一次
const alertMessage = ref(false)
// 在页面加载时检查sessionStorage中的标志
const storedalertMessage = sessionStorage.getItem('alertMessage')
if (storedalertMessage !== 'true') {
  // 如果标志不为true，则提示
  // alertMessage.value = true
  alertMessage.value = false // 不显示提示
}
// 弹出过提示信息
sessionStorage.setItem('alertMessage', 'true')

const initHome = async () => {
  // 获取相册列表
  await homeStore.getAlbumList()
  // 获取图片列表
  await homeStore.getImgList(homeStore.firstAlbumId, homeStore.firstAlbum,true)
  // 设置图片列表
  imgList.value = homeStore.imgList
  // 设置默认打开的相册
  defaultAlbum.value = JSON.stringify(homeStore.albumList[0])
  // 设置当前相册
  homeStore.currentAlbum = homeStore.firstAlbum
  homeStore.currentAlbumId = homeStore.firstAlbumId
}

onMounted(async () => {
  // 获取相册高度
  albumHeight.value = window.innerHeight - albumRef.value.offsetHeight
  // 获取主页面高度
  mainHeight.value = window.innerHeight - headerRef.value.offsetHeight
  
  await initHome()
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

  .albumbtn {
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
  .option-detail:hover {
    background: #95d475;
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
