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

function createElm(vnode){
  // console.log('vnode-c', vnode)
  let {tag,key,data,children,text} = vnode
  if(typeof tag === 'string'){
    // 标签
    vnode.el = document.createElement(tag)
    console.log('vnode.el', vnode.el)
    patchProps(vnode.el,data) // 更新属性
    console.log('children', children)
    if(children){
      children.forEach(child => {
        vnode.el.appendChild(createElm(child))
      })
    }
  }else{
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
function patchProps(el,props){
  for(let key in props){
    // console.log('key', key)
    if(key === 'style'){
      for(let styleName in props.style){
        el.style[styleName] = props.style[styleName]
      }
    }else{
      el.setAttribute(key,props[key])
    }
  }
}

function patch(oldVNode,vnode){
  //  利用vnode替换el节点
  const isRealElement = oldVNode.nodeType
  if(isRealElement){ //判断是否为真实元素
    const elm = oldVNode
    const parentElm = elm.parentNode // 拿到父元素
    console.log('vnode-elm', elm)
    console.log('vnode-parentElm', parentElm)
    let newElm =  createElm(vnode)
    // console.log('newElm', newElm)
    parentElm.insertBefore(newElm,elm.nextSibling)
    parentElm.removeChild(elm)
    return newElm
  }else {
    // diff算法
  }
}

export function initLifeCycle(Vue){
  // 挂载虚拟dom
  Vue.prototype._update = function (vnode){
    const vm = this
    const el = vm.$el
    //有初始化和更新节点的操作
    // console.log('el', el)
    // console.log('vnode', vnode)
    vm.$el = patch(el,vnode)
    console.log('vm.$el', vm.$el)
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
    // console.log('vm.name', vm.name)
    // console.log('vm.age', vm.age)
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm,el){
  vm.$el = el
  // 1.调用render方法产生虚拟节点
  console.log('vm._render(123)',vm._update (vm._render()))
  // vm._update(vm._render())
  // 2.根据虚拟节点DOM产生真实DOM
  // 3.插入到el元素中
}
