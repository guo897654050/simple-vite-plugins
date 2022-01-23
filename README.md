## Vite的本地开发简单实现原理
1. 首先我们知道vite会子啊本地起一个静态服务器，我们使用koa模拟。
2. 返回一个`index.html`，`index.html`的`script`标签插入入口文件地址`main.js`。
3. 递归的加载模块的依赖，替换依赖的地址。(由于vite在本地开发使用的esbuild预先进行了prebuild,我们简化模拟主要从node_modules中读取)

### 实现原理见`svite/svite.js`

1. 对于url的处理，我们需要判断是否来自首页的请求，是的话返回`index.html`。
2. 由于`index.html`的文件有`scipt`的标签，那么会加载这个`main.js`文件。
3. 路由添加对于`.js`的文件的处理。对于js的引入，浏览器会处理相对路径，绝对路径，但是无法处理`import xx from vue`这种，因此我们需要对`import`的语法进行处理。对于引入的是`node_modules`的包，我们使用正则来进行转换，从`node_modules`中进行依赖读取。
4. 如果路径是绝对路径或者相对路径，那么不对url进行处理，否则进行正则替换`from xx` 替换为`from /@modules/xx`。
5. 我们会对转换过的url再次进行处理即`import vue from /@modules/vue`，我们读取到modules后的包名，去node_modules中找到对饮过的模块的`package.json`文件的`modules`字段，然后将路径替换为该module的绝对路径进行加载。至此我们完成了对于`js`文件的处理。
6. 但是我们还要解析`.vue`文件。对于`.vue`的文件我们需要处理`<script>`标签和`<template>`标签。我们通过`compilerSFC`来进行处理，将文件转化为ast，对于`script`的内容，我们通过替换`export default = const __script =`来进行，将其替换成常量。同时由于含有`tempalte`标签，那么我们额外在此常量加上如下内容
```
  import { render as __render } from '${url}?type=template'
  __script.render = __render
    export default __script
```
目的是将`tempalte`在进行一次单独的url匹配处理，为了是不同的url后缀处理不同的事情。通过加上后缀`type=template`来进行处理。
7. 通过`compilerDOM`处理`template`字段，最终`template`还是会转为js文件，通过`createElement`来进行创建dom。将处理后的js文件返回给浏览器即可。

8. 至此我们完成了对于vite的简单的编写！

### 安装
 - npm i (注意不要使用pnpm，因为pnpm会把依赖的硬链接存入.pnpm/node_modules下)
 - cd ./svite && nodemon svite.js

## vite的插件个人实现

### vite-plugin-mock
vite的mock插件，用于本地调试的数据的mock。分析如下：
1. 由于是对于mock数据，那么需要请求url，因此需要在向浏览器发出请求时候，对url进行拦截。
2. 对应的vite的钩子为`configureServer`。此阶段存在参数`server`为vite使用的`connect`模块，无`send`方法。
3. 那么首先读取mock数据的地址，假定为`options.entry`，不存在默认读`./mock/index.ts`
4. 通过`createRouteMap`方法将数据存储。然后读取`req`的url进行匹配。匹配到，返回对应的mockData的response。

### Install
 - npm i or pnpm i
 - npm run dev