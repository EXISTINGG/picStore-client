import { createApp } from 'vue'
import './style.css'
import './utils/rem'
import 'element-plus/theme-chalk/src/message.scss'
import router from './router/index'
import App from './App.vue'

// 导入pinia
import {createPinia} from 'pinia'
// 创建pinia实例
const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
