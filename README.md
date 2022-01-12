## vite的插件个人实现

#### vite-plugin-mock
vite的mock插件，用于本地调试的数据的mock。分析如下：
1. 由于是对于mock数据，那么需要请求url，因此需要在向浏览器发出请求时候，对url进行拦截。
2. 对应的vite的钩子为`configureServer`。此阶段存在参数`server`为vite使用的`connect`模块，无`send`方法。
3. 那么首先读取mock数据的地址，假定为`options.entry`，不存在默认读`./mock/index.ts`
4. 通过`createRouteMap`方法将数据存储。然后读取`req`的url进行匹配。匹配到，返回对应的mockData的response。