import { initMixin } from "./init";
import {initLifeCycle} from './lifecycle'
import {nextTick} from  './observe/watcher'


function Vue(options) {
  this._init(options);
}

Vue.prototype.$nextTick = nextTick

initMixin(Vue);
initLifeCycle(Vue)

Vue.options = {}
Vue.mixin = function (mixin){
  //将用户的选项和全局的options进行合并
  this.options = mergeOptions(this.options,mixin)
  return this
}

function mergeOptions(parent,child){
  let options  = {}
  for (let key in parent){
    mergeField(key)
  }

  for (let key in child){
    if (!parent.hasOwnProperty(key)){
      mergeField(key)
    }
  }

  function mergeField(key){
    options[key] =  child[key] || parent[key]
  }

  return options
}


export default Vue;
