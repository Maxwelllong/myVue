/**
 * created by : Administrator
 * E-mail: 1120502300@qq.com
 * create Time:  19:58
 * File :array.js
 * Update: 2022/8/13 19:58
 * description: 函数
 */

let oldArrayProto = Array.prototype;

export let newArrayPrototype = Object.create(oldArrayProto);

const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];

// 需要对新增的数据进行劫持
methods.forEach(method => {
  newArrayPrototype[method] = function(...args) {
    const res = oldArrayProto[method].call(this, ...args);
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    if (inserted) {
      ob.arrayReative(inserted);
    }
    return res;
  };
});
