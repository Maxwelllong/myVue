/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/15 20:13
 * File : 编译函数
 * Update: 2022/8/15 20:13
 * description:
 */
import parseHTML from './parse'

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?|\n)+?)\}\}/g;

function parseHTML(html) {

  const ELEMENT_TYPE = 1 ;// 元素类型
  const TEXT_TYPE = 3 ;//文本类型
  const stack = [] ;//创建一个栈型结构用于确定元素的父子结构
  let currentParent;
  let root ;

function getProps(attrs){
  let str = ''
  for(let i=0;i<attrs.length;i++){
    let attr = attrs[i]
    if(attr.name === 'style'){
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key,value] =  item.split(':')
        obj[key] = value
      })
      attr.value = obj
  // 创建ast语法树 - 用于将html转化为js语法 - 语法层面转化
  function createASTElement(tag,attrs){
    return {
      tag,
      type:ELEMENT_TYPE,
      children:[],
      attrs,
      parent:null
    }
    str += `${attr.name} : ${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0,-1)}}`
}
const defaultTagRE = /\{\{((?:.|\r?|\n)+?)\}\}/g; // 匹配{{name}}文本
function gen(node){
  if(node.type === 1){
    // 元素节点
    return codeGen(node)
  }else if(node.type === 3){
    // 文本节点hello world
    let text = node.text
    if(!defaultTagRE.test(text)){
      return `_v(${JSON.stringify(text)})`
    }else{ //匹配文本  {{name}}
      let tokens = []
      let match
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      while(match = defaultTagRE.exec(text)){
        let index =  match.index //匹配的位置
        if(index > lastIndex){
          tokens.push(`"${text.slice(lastIndex,index)}"`)
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if(lastIndex < text.length){
        tokens.push(`"${text.slice(lastIndex)}"`)
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(children){
  if(children){
     return children.map(child => gen(child)).join(',')
  }
}

function codeGen(ast){
  let children = genChildren(ast.children)
  // _c 表示生成元素函数
  let code = `_c("${ast.tag}",
  ${
    ast.attrs.length > 0 ? getProps(ast.attrs) : 'null'
  }
  ${
    ast.children.length ? `,${children}`:''
  }
  )`
  return code
  // 循环遍历 删除对应的标签
  while (html) {
    let textEnd = html.indexOf("<")
    if(textEnd == 0){
      // 开始标签
      const startTagMatch = parseStartTag()
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch){
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    if(textEnd > 0){
      let text = html.substring(0,textEnd)
      if(text){
        char(text)
        advance(text.length)
      }
    }
  }
  console.log('ast', ast)
}

// 将模板进行编译成js语法
export function compileToFunction(template) {
  // 1.将template转化为js语法 返回一个数组root[]包含所有的节点及文本
  let ast = parseHTML(template)
  // 2.生成render方法(render方法执行后的返回结果是虚拟dom)
  /**
     *   目标生成一个render函数
     *   render(h){
     *     return h('div',{id：‘app'},h('div',{style:{color:'red'}},_v(_s(name)+’hello')),
     *      _c('div',undefine,)
     *     )
     *   }
     *   其中 _s函数表示转为字符串函数 target._s== toString
     *   其中 _v函数表示创建文本节点 target._v== createTextVNode
     *   其中 _c函数表示创建元素节点 target._c== createElement
     */
  // console.log('ast', ast)
  let code =  codeGen(ast)
  code = `with(this){return ${code}}`
  // console.log('code', code)
  let render = new Function(code)
  return render
}
