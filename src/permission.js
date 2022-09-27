// 权限代码  之后再写
import router from '@/router'
import store from '@/store'

const whileList = ['/login', '/404']
// 任何一个路由跳转，都会进入这个全局前置守卫
router.beforeEach(async(to, from, next) => {
  // to 将要进入的目标
  // from当前导航正要离开的路由
  // console.log(to)
  // console.log(from)
  // next(false) // 中断当前的导航
  // 判断token是否存在
  if (store.getters.token) {
    // 有token，继续判断是否去登录页
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
      // 用await是为了获取完才放行
    }
    if (to.path === '/login') {
      // 表示去的是登录页
      next('/') // 跳转主页
    } else {
      next() // 直接放行
    }
  } else { // 没有token
    if (whileList.includes(to.path)) {
      // includes 判断是否在该数组中
      next()
    } else {
      next('/login')
    }
  }
})
