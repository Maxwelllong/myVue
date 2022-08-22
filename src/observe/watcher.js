/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/20 15:47
 * File : myVue
 * Update: 2022/8/20 15:47
 * description:
 */
import Dep from './dep'
let id = 0

/**
 * 1.当创建渲染watcher的时候，就会把当前的渲染watcher放到Dep.target上
 * 2.调用_render()会取值，走到get上。
 */

// new Watcher会执行constructer中的内容
class Watcher{
  //fn函数为更新视图函数
  constructor(vm,fn,options) {
    this.id = id++
    this.isRenderWatcher = options // 标识渲染watcher
    this.getter = fn // 渲染函数
    this.deps = [] //存放所有的dep
    this.get() // 首次渲染自动更新
  }
  get(){
    Dep.target = this;
    this.getter() ;// 调用更新
    Dep.target = null;// 渲染完清空
    this.depsId = new Set();
  }
  addDep(dep){
    this.id = dep.id
    if(!this.depsId.has(id)){
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this) // watcher记住了dep，dep也记住watcher
    }
  }
  update(){
    quenUpdate(this)
  }
  run(){
    console.log('run')
    this.get()
  }
}

let quenen = []
let has = {}
let pedding = false ;

function refreshScheduleQueue(){
  let freshQueue = quenen.slice(0)
  quenen = [];
  has = {}
  pedding = false
  freshQueue.forEach(q => q.run())
}

function quenUpdate(watcher){
  const id = watcher.id
  if (!has[id]){
    quenen.push(watcher)
    has[id] = true
  //  不管updata执行多少次，只执行一次刷新操作
    if(!pedding){
      setTimeout(refreshScheduleQueue,0)
    }
  }
}

// 需要给每个属性增加一个dep，目的是收集watcher
// 一个视图中 有多个属性 或者 一个属性可以对应多个视图


export default Watcher

