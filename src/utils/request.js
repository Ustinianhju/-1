// 实现对axios的二次封装
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// 通过axios创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})

service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // 1.考虑把那些数据跑出去
  // 2.接口成功，并且业务成功
  // 3.没有成功，Promise.reject 抛出错误
  const { message, data, success } = response.data
  if (success) {
    // 业务逻辑是成功的
    return data
  }
  // 业务逻辑没有成功
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service
