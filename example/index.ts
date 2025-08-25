import { Server } from 'vafast'
import { html } from '../src'

const app = new Server([
	{
		method: 'GET',
		path: '/',
		handler: (req: any) => {
			return req.html.html(`
				<!DOCTYPE html>
				<html>
					<head>
						<title>Vafast HTML Plugin</title>
					</head>
					<body>
						<h1>Hello from Vafast HTML Plugin!</h1>
						<p>This is a simple HTML response.</p>
					</body>
				</html>
			`)
		}
	},
	{
		method: 'GET',
		path: '/stream',
		handler: (req: any) => {
			return req.html.stream(
				({ id }: { id: number }) => `
				<!DOCTYPE html>
				<html>
					<head>
						<title>Streaming HTML</title>
					</head>
					<body>
						<h1>Streaming Response</h1>
						<p>ID: ${id}</p>
						<p>Time: ${new Date().toISOString()}</p>
					</body>
				</html>
			`,
				{ timestamp: Date.now() }
			)
		}
	}
])

// 使用 HTML 插件
app.use(html())

// 导出用于 Bun 服务器
export default {
	fetch: (req: Request) => app.fetch(req)
}
