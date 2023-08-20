import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import {getItem} from './localStorage'
 

// (有Loading效果)
export const request = axios.create({
  baseURL: 'https://picapi.hxq-001.top',
  // 请求超时时间
  timeout: 10000,
  // headers: {
  //   'Authorization': token
  // }
})
// (无Loading效果)
export const requests = axios.create({
  baseURL: 'https://picapi.hxq-001.top',
  // 请求超时时间
  timeout: 10000
})

let loading

const startLoad = () => {
  loading =  ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, .7)',
    // fullscreen: true,
    // body: true,
    target: 'content-box'
  })
}
const endLoad = () => {
  loading.close()
}

// 声明请求拦截器(有Loading效果)
request.interceptors.request.use(config => {
  const token = getItem('TOKEN');
  // 添加token
  config.headers['Authorization'] = token;
  //展示 Loading 效果
  startLoad()
  return config
}, err => {
  ElMessage.error(err.message)
  loading.close()
  return Promise.reject(err)
})

// 声明响应拦截器
request.interceptors.response.use(response => {
  //隐藏 Loading 效果
  // loading.close()
  endLoad()
  return response
}, err => {
  ElMessage.error(err.message)
  loading.close()
  return Promise.reject(err)
})

// 声明请求拦截器(无Loading效果)
requests.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})
// 声明响应拦截器
requests.interceptors.response.use(response => {
  return response
}, err => {
  return Promise.reject(err)
})