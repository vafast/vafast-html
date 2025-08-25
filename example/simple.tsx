import { Server } from 'vafast'
import { html } from '../src'

const app = new Server([
	{
		method: 'GET',
		path: '/a',
		handler: (req: any) => req.html.html(`<h1>Hello World</h1>`)
	}
])

app.use(html({ autoDetect: true }))

// 导出用于 Bun 服务器
export default {
	fetch: (req: Request) => app.fetch(req)
}
