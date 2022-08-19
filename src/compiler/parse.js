/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/17 20:14
 * File : miniVue
 * Update: 2022/8/17 20:14
 * description:转化为AST语法数
 */
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
  const stack = [] ;//创建一个栈型结构
  let currentParent;
  let root ;

  // 创建ast语法树木
  function createASTElement(tag,attrs){
    return {
      tag,
      type:ELEMENT_TYPE,
      attrs,
      children:[],
      parent:null
    }
  }

  function start(tag,attr){
    let node = createASTElement(tag,attr)
    // 如果没有根节点则当前节点为根节点
    if(!root){
      root = node
    }
    if(currentParent){
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }
  function char(text){
    text = text.replace(/\s/g,'')
    text && currentParent.children.push(
      {
        type:TEXT_TYPE,
        text,
        parent:currentParent
      }
    )
  }
  function end(tagName){
    let node = stack.pop()
    currentParent = stack[stack.length -1]
  }

  function advance(n) {
    html = html.substring(n); // 截取html
  }

  function parseStartTag() {

    // console.log('startTagOpen', startTagOpen)
    // 匹配<div
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      let end, attr;
      console.log('startTagClose', startTagClose)
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
        ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true
        });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }
  // 循环遍历 删除对应的标签
  while (html) {
    // 找到开始与结束标签
    let textEnd = html.indexOf("<")
    if(textEnd == 0){
      // 开始标签
      const startTagMatch = parseStartTag()
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue
      }
      // 结束标签
      // console.log('endTag', endTag)
      // 匹配 </div>
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
  return root
}

export default parseHTML
