const Koa = require('koa');
const app = new Koa();
const path = require('path')
const fs = require('fs')
const compilerSFC = require('@vue/compiler-sfc')
const compilerDOM = require('@vue/compiler-dom')


app.use(ctx => {
  const { url, query } = ctx.request;
  if (url === '/') {
    const indexPath = path.join(__dirname, './index.html');
    const file = fs.readFileSync(indexPath, 'utf-8');
    ctx.type = 'text/html'
    ctx.body = file
  } else if (url.endsWith('.js')) {
    // js文件加载处理
    const p = path.join(__dirname, url);
    ctx.type = "application/javascript";
    ctx.body = rewriteImport(fs.readFileSync(p, "utf-8"));
  } else if (url.startsWith("/@modules/")) {
    // 裸模块名称
    const moduleName = url.replace("/@modules/", "");
    // 去node_modules目录中找
    const prefix = path.join(__dirname, "../node_modules", moduleName);
    // package.json中获取module字段
    const module = require(prefix + "/package.json").module;
    const filePath = path.join(prefix, module);
    const ret = fs.readFileSync(filePath, "utf8");
    ctx.type = "application/javascript";
    ctx.body = rewriteImport(ret);
  } else if (url.indexOf('.vue') > -1) {
    //SFC component
    // 读取vue文件解析为js
    const absPath = path.join(__dirname, url.split("?")[0]);
    const astRet = compilerSFC.parse(fs.readFileSync(absPath, 'utf-8'));
    console.log('ast', astRet)
    if (!query.type) {
      // 获取js内容
      const scriptConetent = astRet.descriptor.script.content;
      // 替换默认导出为常量
      const script = scriptConetent.replace(`export default `, 'const __script = ')
      ctx.type = 'application/javascript';
      ctx.body = `
        ${rewriteImport(script)}
        // 解析模板
        import { render as __render} from '${url}?type=template'
        __script.render = __render
        export default __script
      `
    } else if (query.type === 'template') {
      const tpl = astRet.descriptor.template.content;
      // 编译为js
      const render = compilerDOM.compile(tpl, { mode: 'module' }).code
      ctx.type = 'application/javascript'
      ctx.body = rewriteImport(render)
    }
  }
})

function rewriteImport(content) {
  return content.replace(/ from ['"](.*)['""]/g, (s1, s2) => {
    if (s2.startsWith('./') || s2.startsWith('../') || s2.startsWith('/')) {
      return s1
    } else {
      // 代表说import路径，替换
      return ` from '/@modules/${s2}'`
    }
  })
}

app.listen(3000, () => {
  console.log('simple vite start!!')
})