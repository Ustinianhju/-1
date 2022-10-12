// import PageTools from './PageTools/index.vue'
// const component = [PageTools]
// 引入要注册的组件
// 把组件用数组收集起来
// 再用Vue.use(pligin)
// pligin对象，install属性 ==> 会被执行 install方法 ==> 第一个参数 Vue
// 函数被indtall方法 ==> 会被执行 函数 第一个参数Vue
// Vue.use({})

// 全局注册: Vue.component(组件名称, 组件对象)
// 统一注册：Vue.use()

// export default {
//   install: function(Vue) {
//     component.forEach(ele => {
//       Vue.component(ele.name, ele)
// Vue.component('组件名称'，组件对象)
//     })
//   }
// }

// 实现组件的自动注册
// require.context()
import * as filters from '@/filters'

const fn = require.context('./', true, /\.vue$/)
console.log(fn.keys()) // 路径
console.log(fn('./PageTools/index.vue')) // 根据路径查找模块

// 一次性导入所有的模块
// fn.keys() ==> 返回所有的模块 ['./PageTools/index.vue']
const components = fn.keys().map(ele => {
  return fn(ele)
})

export default (Vue) => {
  components.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
  // Vue.filter('过滤器名称','过滤器的方法')
  Object.keys(filters).forEach(key => {
    // console.log(key)
    Vue.filter(key, filters[key])
  })
}
