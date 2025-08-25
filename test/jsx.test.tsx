import { describe, expect, it } from 'bun:test'
import { Server } from 'vafast'
import { html } from '../src'

function request(path: string) {
	return new Request(`http://localhost${path}`)
}

function handler() {
	return (
		<>
			{'<!DOCTYPE HTML>'}
			<html lang="en">
				<head>
					<title>Hello World</title>
				</head>
				<body>
					<h1>Hello World</h1>
				</body>
			</html>
		</>
	)
}

describe('Jsx html', () => {
	it('auto return html', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('<html><body><h1>Hello World</h1></body></html>', {
					headers: { 'Content-Type': 'text/html' }
				})
			}
		])
		app.use(html())
		
		const res = await app.fetch(request('/'))
		expect(await res.text()).toContain('Hello World')
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})
})

describe('HTML', () => {
	it('manual return html', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => (req as any).html.html(handler())
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))
		expect(await res.text()).toContain('Hello World')
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('inherits header', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => {
					const response = (req as any).html.html(<h1>Hi</h1>)
					if (response instanceof Response) {
						response.headers.set('Server', 'Vafast')
					}
					return response
				}
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))
		expect(res.headers.get('Server')).toBe('Vafast')
	})

	it('return any html tag', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('<html>Hello World</html>', {
					headers: { 'Content-Type': 'text/html' }
				})
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
	})

	it('consistently identifies html content', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response('<h1></h1>', {
					headers: { 'Content-Type': 'text/html' }
				})
			}
		])
		app.use(html())

		let res = await app.fetch(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
		res = await app.fetch(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
		res = await app.fetch(request('/'))
		expect(res.headers.get('Content-type')).toBe('text/html; charset=utf8')
	})
})
