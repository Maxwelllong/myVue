/**
 * created by : Administrator
 * E-mail:
 * create Time: 2022/8/15 20:13
 * File : 编译函数
 * Update: 2022/8/15 20:13
 * description:
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
      children:[],
      attrs,
      parent:null
    }
  }

  function start(tag,attr){
    console.log('start', tag,attr)
  }
  function char(text){
    console.log('char', text)
  }
  function end(tagName){
    console.log('end', tagName)
  }

  function advance(n) {
    html = html.substring(n); // 截取html
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      let end, attr;
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
    // break
    // debugger
  }
  console.log('html', html)
}

export function compileToFunction(template) {
  // 1.将template转化为js语法
  parseHTML(template);
  // 2.生成render方法(render方法执行后的返回结果是虚拟dom)
}
