// 实现对axios的二次封装
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
const TimeOut = 1
// 对比时间是否超时
function IsCheckTimeOut() {
  const currentTime = Date.now() // 时间2 接口真正调用的时间
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp > TimeOut // true 超时 /false 没有超时
}

// 通过axios创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 时间2-时间1 > token 超时的时间 ==> token登录失败
    if (IsCheckTimeOut()) { // 超时
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 超时'))
    }
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
  // console.log(error.response)
  if (error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('token 超时')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default service
