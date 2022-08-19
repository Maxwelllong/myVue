/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/18 23:06
 * File : myVue
 * Update: 2022/8/18 23:06
 * description: 创建虚拟节点
 */
// h() _c()
export function createElementVNode(vm,tag,data={},...children){
  if(data === null){
    data = {}
  }
  let key = data.key
  if(key){
    delete data.key
  }
  return vnode(vm,tag,key,data,children)
}

// _v()
export function createTextVNode(vm,text){
  return vnode(vm,undefined,undefined,undefined,undefined,text)
}

// ast做的时语法层面的转化，描述的是语法本身
// 虚拟dom描述的时dom元素，可以增加一些自定义属性（描述dom)
function vnode(vm,tag,key,data,children,text){
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}


