/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/20 16:03
 * File : myVue
 * Update: 2022/8/20 16:03
 * description:依赖收集
 */

let id= 0;

class Dep{
  constructor() {
    this.id = id++ //属性的dep要收集watcher
    this.subs = [] // 存放当前属性对应的watcher
  }
  //此处的Dep.target是watcher 参数this是Dep
  depend(){
    //将wacher放到subs中
    Dep.target.addDep(this)
  }
  addSub(watcher){
    this.subs.push(watcher)
  }
  notify(){
    this.subs.forEach(watcher => watcher.update()) // 通知watcher更新
  }
}

Dep.target = null

export default Dep
