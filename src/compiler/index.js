/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/15 20:13
 * File : 编译函数
 * Update: 2022/8/15 20:13
 * description:
 */
import parseHTML from './parse'

export function compileToFunction(template) {
  // 1.将template转化为js语法
  let ast = parseHTML(template)
  // 2.生成render方法(render方法执行后的返回结果是虚拟dom)
  console.log('ast', ast)
}
