import { newArrayPrototype } from "./array";

export function observe(data) {
  if (typeof data !== "object" || data === null) return;

  return new Observe(data);
}

class Observe {
  constructor(data) {
    data.__ob__ = this;
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false
    });
    if (Array.isArray(data)) {
      /*
        1.调用方法对数组的7个方法进行监测，如果调用了那7个方法则响应式数据
       */
      data.__proto__ = newArrayPrototype;
      this.arrayReative(data);
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    Object.keys(data).forEach(item => defineReactive(data, item, data[item]));
  }
  // 判断数组里面是否有对象，有对象则调用observe对对象进行观测
  arrayReative(data) {
    data.forEach(item => {
      observe(item);
    });
  }
}

function defineReactive(target, key, value) {
  observe(value);
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue);
      value = newValue;
    }
  });
}
