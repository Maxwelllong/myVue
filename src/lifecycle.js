/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/18 22:42
 * File : myVue
 * Update: 2022/8/18 22:42
 * description: 组件挂载
 * Vue核心流程：1.创造响应式数据；
 *            2.模板转化为Ast语法树；
 *            3.将ast语法树转为render函数；
 *            4.后续每次数据更新可以只执行render函数（无需再次执行ast转化过程）；
 *
 */
import {createTextVNode,createElementVNode} from './vdom'

export function initLifeCycle(Vue){
  // 挂载虚拟dom
  Vue.prototype._update = function (vnode){
    console.log('update',vnode)
  }
  /**
   * _c('div',{},...children)
   * 创建虚拟元素
   **/
  Vue.prototype._c = function (){
    return createElementVNode(this,...arguments)
  }
  /**
   * 创建虚拟文本节点
   * */
  Vue.prototype._v =function (){
    return createTextVNode(this,...arguments)
  }
  /**
   * 转为字符串
   * */
  Vue.prototype._s = function (value){
    if(typeof value !== 'object') return value
    return JSON.stringify(value)
  }

  // 渲染虚拟dom
  Vue.prototype._render = function (){
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm,el){
  // 1.调用render方法产生虚拟节点
  vm._update(vm._render())
  // 2.根据虚拟节点DOM产生真实DOM
  // 3.插入到el元素中
}
