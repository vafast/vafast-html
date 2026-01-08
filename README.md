# @vafast/html

HTML rendering plugin for Vafast framework.

## Features

- 🚀 **Fast HTML Rendering** - Efficient HTML response handling
- 🔧 **Easy Integration** - Simple middleware integration with Vafast
- 📝 **JSX Support** - Support for JSX elements and streaming
- 🎯 **Auto Detection** - Automatically detect and handle HTML responses
- ⚡ **Streaming Support** - Built-in streaming HTML responses

## Installation

```bash
npm install @vafast/html
```

## Quick Start

```typescript
import { createServer } from "vafast";
import { html } from "@vafast/html";

const app = createServer();

// Use HTML plugin
app.use(html());

// Define routes
app.get("/", (req) => {
  return req.html.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Hello from Vafast!</h1>
      </body>
    </html>
  `);
});

app.listen(3000);
```

## API

### `html(options?: HtmlOptions)`

Creates an HTML middleware with the specified options.

#### Options

- `contentType` - Content-Type header for HTML responses (default: `"text/html; charset=utf8"`)
- `autoDetect` - Automatically detect HTML responses (default: `true`)
- `autoDoctype` - Automatically add DOCTYPE to HTML (default: `true`)
- `isHtml` - Custom function to detect HTML content

### `req.html.html(value: string | JSX.Element)`

Renders HTML content and returns a Response object.

### `req.html.stream<T>(value: Function, args: T)`

Creates a streaming HTML response.

## Examples

### Basic HTML Response

```typescript
app.get("/page", (req) => {
  return req.html.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Page</title>
      </head>
      <body>
        <h1>Welcome!</h1>
        <p>This is a simple HTML page.</p>
      </body>
    </html>
  `);
});
```

### Streaming Response

```typescript
app.get("/stream", (req) => {
  return req.html.stream(({ id }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Streaming</title>
      </head>
      <body>
        <h1>Stream ID: ${id}</h1>
        <p>Generated at: ${new Date().toISOString()}</p>
      </body>
    </html>
  `, { timestamp: Date.now() });
});
```

### Custom Options

```typescript
app.use(html({
  contentType: "text/html; charset=UTF-8",
  autoDetect: true,
  autoDoctype: false
}));
```

## Migration from Elysia

If you're migrating from `@elysiajs/html`, the main changes are:

1. **Import**: Change from `import { html } from '@elysiajs/html'` to `import { html } from '@vafast/html'`
2. **Usage**: Use `app.use(html())` instead of `app.use(html())`
3. **API**: The API remains the same: `req.html.html()` and `req.html.stream()`

## License

MIT
