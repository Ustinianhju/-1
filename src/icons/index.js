import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
// req 函数 ==》根据路径，对应的模块导入进去
// 函数keys属性 => 方法 =>  数组
// console.log(req.keys());
// 不想一个一个import

const requireAll = requireContext => requireContext.keys().map(requireContext)
// map 返回的一个新数组
// 长度和原来的一样
// 映射
requireAll(req)
console.log(requireAll(req))

// function fn(val) { return val }
//  [1,2,3].map(fn)
