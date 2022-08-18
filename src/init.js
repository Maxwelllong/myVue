import { initState } from "./initState";
import { compileToFunction } from "./compiler";

export function initMixin(vm) {
  vm.prototype._init = function(options) {
    const vm = this;
    vm.$options = options; // 将options挂载到实例上方便后面的扩展使用options
    initState(vm);
    if (options.el) {
      vm.$mount(options.el);
    }
  };
  vm.prototype.$mount = function(el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    if (!ops.render) {
      //先看是否有render函数
      let template; // 没有render看一下是否有template,没写template采用外部template
      if (!ops.template && el) {
        // 没有写模板但是写了el则使用模板
        template = el.outerHTML;
      } else {
        if (el) {
          template = ops.template;
        }
      }
      // 对模板进行编译
      if (template) {
        const render = compileToFunction(template);
        ops.render = render;
      }
    }
    console.log('ops.render', ops.render)
  };
}
