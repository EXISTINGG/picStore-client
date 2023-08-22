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


console.log( 
  `%c                      _                                   \n` +
  `%c                     | |                                  \n` +
  `%c        __      _____| | ___ ___  _ __ ___   ___          \n` +
  `%c        \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\         \n` +
  `%c         \\ V  V /  __/ | (_| (_) | | | | | |  __/         \n` +
  `%c          \\_/\\_/ \\___|_|\\___\\___/|_| |_| |_|\\___|         \n` +
  `                                                          \n`,
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
);
console.log(
  `%c               _                                          \n` +
  `%c ███████╗██╗░░██╗██╗░██████╗████████╗██╗███╗░░██╗░██████╗░\n` +
  `%c ██╔════╝╚██╗██╔╝██║██╔════╝╚══██╔══╝██║████╗░██║██╔════╝░\n` +
  `%c █████╗░░░╚███╔╝░██║╚█████╗░░░░██║░░░██║██╔██╗██║██║░░██╗░\n` +
  `%c ██╔══╝░░░██╔██╗░██║░╚═══██╗░░░██║░░░██║██║╚████║██║░░╚██╗\n` +
  `%c ███████╗██╔╝╚██╗██║██████╔╝░░░██║░░░██║██║░╚███║╚██████╔╝\n` +
  `%c ╚══════╝╚═╝░░╚═╝╚═╝╚═════╝░░░░╚═╝░░░╚═╝╚═╝░░╚══╝░╚═════╝░`,
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:#fff;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
);
console.log(
  `%c               _                                          \n` +
  `%c ███████╗██╗░░██╗██╗░██████╗████████╗██╗███╗░░██╗░██████╗░\n` +
  `%c ██╔════╝╚██╗██╔╝██║██╔════╝╚══██╔══╝██║████╗░██║██╔════╝░\n` +
  `%c █████╗░░░╚███╔╝░██║╚█████╗░░░░██║░░░██║██╔██╗██║██║░░██╗░\n` +
  `%c ██╔══╝░░░██╔██╗░██║░╚═══██╗░░░██║░░░██║██║╚████║██║░░╚██╗\n` +
  `%c ███████╗██╔╝╚██╗██║██████╔╝░░░██║░░░██║██║░╚███║╚██████╔╝\n` +
  `%c ╚══════╝╚═╝░░╚═╝╚═╝╚═════╝░░░░╚═╝░░░╚═╝╚═╝░░╚══╝░╚═════╝░`,
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
  'color:000;background-image: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);',
);
console.log(
  `%c ███████╗██╗░░██╗██╗░██████╗████████╗██╗███╗░░██╗░██████╗░\n` +
  `%c ██╔════╝╚██╗██╔╝██║██╔════╝╚══██╔══╝██║████╗░██║██╔════╝░\n` +
  `%c █████╗░░░╚███╔╝░██║╚█████╗░░░░██║░░░██║██╔██╗██║██║░░██╗░\n` +
  `%c ██╔══╝░░░██╔██╗░██║░╚═══██╗░░░██║░░░██║██║╚████║██║░░╚██╗\n` +
  `%c ███████╗██╔╝╚██╗██║██████╔╝░░░██║░░░██║██║░╚███║╚██████╔╝\n` +
  `%c ╚══════╝╚═╝░░╚═╝╚═╝╚═════╝░░░░╚═╝░░░╚═╝╚═╝░░╚══╝░╚═════╝░`,
  'background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%); color: transparent;',
  'background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%); color: transparent;',
  'background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%); color: transparent;',
  'background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%); color: transparent;',
  'background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%); color: transparent;',
  'background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%); color: transparent;',
);

