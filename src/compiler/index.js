/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/15 20:13
 * File : 编译函数
 * Update: 2022/8/15 20:13
 * description:
 */
import parseHTML from './parse'

function getProps(attrs){
  let str = ''
  for(let i=0;i<attrs.length;i++){
    let attr = attrs[i]
    if(attr.name === 'style'){
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key,value] =  item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name} : ${JSON.stringify(attr.value)},`
  }
  return `${str.slice(0,-1)}`
}
const defaultTagRE = /\{\{((?:.|\r?|\n)+?)\}\}/g; // 匹配{{name}}文本
function gen(node){
  if(node.type === 1){
    // 元素节点
    return codeGen(node)
  }else if(node.type === 3){
    // 文本节点
    let text = node.text
    if(!defaultTagRE.exec(text)){
      return `_v(${JSON.stringify(text)})`
    }else{
      let token = [];
      let match ;
      let lastIndex = 0;
      defaultTagRE.lastIndex = 0
      while(match =  defaultTagRE.exec(text)){
        let index = match.index;
        if(index > lastIndex){
          token.push(JSON.stringify( text.slice(lastIndex,index)))
        }
        token.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if(lastIndex < text.length){
        token.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${token.join('+')})`
    }
  }
}

function genChildren(el){
 return el.map(child => gen(child))
}

function codeGen(ast){
  let children = genChildren(ast.children)
  let code = (`_c("${ast.tag}",${
    ast.attrs.length > 0 ? getProps(ast.attrs) : 'null'
  }${
    ast.children.length ? `,${children}`:'null'
  }
  )`)
  return code
}

export function compileToFunction(template) {
  // 1.将template转化为js语法
  let ast = parseHTML(template)
  // 2.生成render方法(render方法执行后的返回结果是虚拟dom)
  console.log('ast', ast)
  const genCode =  codeGen(ast)
  console.log('genCode', genCode)
}
