import { login } from '@/api/login'
import { getInfo, getUserFateilById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    RMOVE_USERINFO(state) {
      state.userInfo = {}
    },
    REMOVE_TOKEN(state) {
      state.token = null
    },
    SET_HRSAAS_TIME(state, hrsaasTime) {
      state.hrsaasTime = hrsaasTime // 属于获取到token的时间
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      const data = await login(loginData)
      // console.log(data)
      commit('SET_TOKEN', data)
      commit('SET_HRSAAS_TIME', new Date().getTime())
    },
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getInfo()
      console.log(res)
      const res1 = await getUserFateilById(res.userId)
      const result = { ...res, ...res1 }
      commit('SET_USERINFO', result)
      return JSON.parse(JSON.stringify(result)) // 后面会讲
    },
    logout({ commit }) {
      // NavBar中使用清除浏览器中的token值，返回到登录页面
      // 清除庲的数据  ==> token userInfo
      commit('RMOVE_USERINFO')
      commit('REMOVE_TOKEN')
    }
  }
}
