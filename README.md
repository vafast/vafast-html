# @vafast/html

在请求上挂载 `req.html`，通过 `html()` / `stream()` 返回 HTML（配合 [@kitajs/html](https://github.com/kitajs/html)）。

> **不要直接 `return` HTML 字符串。** 框架会把普通 `string` 当成 `text/plain`。必须使用 `req.html.html(...)`。

## 安装

```bash
npm install @vafast/html
```

## 快速开始

```typescript
import { Server, defineRoute, defineRoutes, serve } from 'vafast'
import { html } from '@vafast/html'

type HtmlRequest = Request & {
  html: {
    html: (value: string) => Response | string | Promise<Response | string>
  }
}

const routes = defineRoutes([
  defineRoute({
    method: 'GET',
    path: '/',
    handler: ({ req }) => {
      return (req as HtmlRequest).html.html(`
        <!doctype html>
        <html><body><h1>Hello</h1></body></html>
      `)
    },
  }),
])

const server = new Server(routes)
server.use(html())
serve({ fetch: server.fetch, port: 3000 })
```

## 用法

### 流式渲染

```typescript
handler: ({ req }) =>
  (req as any).html.stream(
    ({ id, title }) => `<html><body><h1>${title} #${id}</h1></body></html>`,
    { title: 'Stream' },
  )
```

### 自定义选项

```typescript
server.use(
  html({
    contentType: 'text/html; charset=utf8',
    autoDetect: true,
    autoDoctype: true,
  }),
)
```

## API 完整参数

### `html(options?)` / `createHtmlPlugin(options?)`

| 参数 | 默认 | 说明 |
|------|------|------|
| `contentType` | `'text/html; charset=utf8'` | Content-Type |
| `autoDetect` | `true` | 下游已是 HTML Response 时统一 content-type |
| `autoDoctype` | `true` | 经 `html()`/`stream()` 且以 `<html` 开头时加 doctype |
| `isHtml` | 内置 | 字符串是否像 HTML |

### `req.html`

| 方法 | 说明 |
|------|------|
| `html(value)` | 渲染为 HTML `Response` |
| `stream(fn, args)` | Suspense 流式渲染 |

另导出：`Html`、`createElement`、`ErrorBoundary`、`isHtml` 等。

## 最佳实践

- 一律 `return req.html.html(...)`
- 大页面考虑 `stream`
- 全局 `server.use(html())` 一次即可

## 注意事项

- 普通字符串返回值 = **`text/plain`**
- `autoDetect` 不会把 plain string 变成 HTML
- `autoDoctype: 'full'` 不会让未调用 `html()` 的字符串自动变成 HTML 响应

## 相关链接

- 文档：[`docs/middleware/html.md`](../vafast-doc/docs/middleware/html.md)
- [kitajs/html](https://github.com/kitajs/html)

## License

MIT
