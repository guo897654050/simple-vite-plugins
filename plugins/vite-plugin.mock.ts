import { ViteDevServer } from 'vite';
import type { IOptions, IMockItem, IRoute } from './type';
import path from 'path';


export default function (options: IOptions = {}) {
  let entry = options.entry || './mock/index.ts';
  // check path is absPath
  if (!path.isAbsolute(entry)) {
    entry = path.resolve(process.cwd(), './mock/index.ts');
  }

  const routeMap: Record<string, IRoute[]> = {}
  function createRouteMap(mockConfig: IMockItem[]) {
    mockConfig.forEach((mockItem) => {
      let url = mockItem.url;
      let method = mockItem.type.toLowerCase();
      let handler = mockItem.response;
      let route = { url, method, handler };
      if (!routeMap[method]) {
        routeMap[method] = [];
      }
      routeMap[method].push(route);
    })
  }

  function matchRoute(url: string | undefined, method: string | undefined) {
    if (url) {
      return routeMap[method!.toLowerCase()].find((route) => route.url === url)
    }
    return null;
  }

  return {
    name: 'vite-plugin-mock',
    // 由于mock数据需要拦截url，在此钩子阶段进行
    configureServer(server: ViteDevServer): void {
      const mockConfig = require(entry);
      createRouteMap(mockConfig);
      server.middlewares.use((req, res, next) => {
        const route = matchRoute(req?.url, req?.method);
        if (route) {
          const responseData = route.handler();
          // 简单使用JSON.stringify()处理
          let chunk = Buffer.from(JSON.stringify(responseData), 'utf-8');
          res.setHeader('Content-length', chunk.length);
          res.setHeader('Content-type', 'application/json');
          res.statusCode = 200;
          res.end(chunk);
        } else {
          // 读取其他中间件
          next();
        }
      })
    }
  }
}