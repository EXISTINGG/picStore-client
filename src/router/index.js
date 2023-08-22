import { createRouter, createWebHashHistory } from 'vue-router'
import { getItem} from '@/utils/localStorage'
import {warning} from '@/utils/message'


const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', 
    name: 'Home', 
    component: () => import('@/views/Home.vue'),
    meta: {title: '首页😀'},
    children: [
      
    ]
  },
  {path: '/test', name: 'test', component: () => import('@/views/Test.vue')},
  {path: '/login', name: 'Login', component: () => import('@/views/login.vue'),meta: {title: '登录😍'},},
  {path: '/upload', name: 'Upload', component: () => import('@/views/uploadimg/uploadimg.vue'),meta: {title: '图片上传-本地'},},
  {path: '/urlupload', name: 'UrlUpload', component: () => import('@/views/uploadimg/urlUpload.vue'),meta: {title: '图片上传-链接'},},
  {path: '/checkimg', name: 'Checkimg', component: () => import('@/views/uploadimg/checkimg.vue'),meta: {title: '图片检测-本地'},},
  {path: '/urlcheck', name: 'UrlCheck', component: () => import('@/views/uploadimg/urlCheck.vue'),meta: {title: '图片检测-链接'},},
  {path: '/user', name: 'User', component: () => import('@/views/user/index.vue'),meta: {title: '用户中心'},},
  {path: '/about', name: 'About', component: () => import('@/views/about.vue'),meta: {title: '关于'},},
  { 
    path: '/admin', 
    name: 'Admin', 
    component: () => import('@/views/admin/index.vue'),
    redirect: '/admin/user/userlist',
    meta: {title: '后台管理'},
    children: [
        {path: 'user/userlist', name: 'Userlist', component: () => import('@/views/admin/user/userList.vue'),meta: {title: '用户列表'}},
        {path: 'user/deleteuser', name: 'Deleteuser', component: () => import('@/views/admin/user/deleteUser.vue'),meta: {title: '已注销用户'}},
        {path: 'api/apilist', name: 'Apilist', component: () => import('@/views/admin/apiAdmin/apiList.vue'),meta: {title: 'api管理'}},
    ]
  },
  // 404
	{ path: '/404', component: () => import('@/views/NotFound.vue') },
	{ path: '/:pathMatch(.*)', redirect: '/404' }
]

// 创建路由实例对象
const router = createRouter({
  // 通过createWebHashHistory属性指定路由工作模式
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果登录后要去登录页，则返回原页面
  if(to.path == 'Login' && getItem('TOKEN') && getItem('user')) next(from.path)
  // 如果没有登录去用户中心页面,则返回
  if(to.name == 'User' && !getItem('TOKEN') && !getItem('user')) next(from.path)
  // 去管理页面
  if(/admin/.test(to.path)) {
    // 没有登录
    if(!getItem('TOKEN') && !getItem('user')) {
      warning('请使用管理员账号登录')
      return next('/login')
      // 登录但账号权限不足
    } else if (getItem('TOKEN') && getItem('user').power != 1 && getItem('user').power != 2) {
      console.log(getItem('user').power);
      warning('请使用管理员账号登录')
      return next(from.path)
    } else {
      next()
    }
  }

  else next()
});

const beforTitle = 'Existing图床'

// 全局后置守卫
router.afterEach((to,from,next) => {
  document.title = `${beforTitle} | ${to.meta.title || ''}`
  // next()
})


//共享路由
export default router
