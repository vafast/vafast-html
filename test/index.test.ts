import { Server } from 'vafast'
import { html } from '../src'

import { describe, expect, it } from 'bun:test'

const req = (path: string) => new Request(`http://localhost${path}`)

const page = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

describe('HTML', () => {
	it('auto return html', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response(page, { headers: { 'Content-Type': 'text/html' } })
			}
		])
		app.use(html())

		const res = await app.fetch(req('/'))
		expect(await res.text()).toBe(page)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('manual return html', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => (req as any).html.html(page)
			}
		])
		app.use(html())

		const res = await app.fetch(req('/'))
		expect(await res.text()).toBe(page)
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	it('inherits header', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => {
					const response = (req as any).html.html('<h1>Hi</h1>')
					if (response instanceof Response) {
						response.headers.set('Server', 'Vafast')
					}
					return response
				}
			}
		])
		app.use(html())

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Server')).toBe('Vafast')
	})

	it('return any html tag', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response(`<html>Hello World</html>`, { headers: { 'Content-Type': 'text/html' } })
			}
		])
		app.use(html())

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
	})

	it('consistently identifies html content', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => new Response(`<h1>Hi</h1>`, { headers: { 'Content-Type': 'text/html' } })
			}
		])
		app.use(html())

		let res = await app.fetch(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
		res = await app.fetch(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
		res = await app.fetch(req('/'))
		expect(res.headers.get('Content-type')).toContain(
			'text/html; charset=utf8'
		)
	})
})

describe('HTML vs No html - header', () => {
	it('inherits header plain response when using the html plugin', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => {
					const response = new Response('Hello')
					response.headers.set('Server', 'Vafast')
					return response
				}
			}
		])
		app.use(html())
		
		const res = await app.fetch(req('/'))
		expect(res.headers.get('Server')).toBe('Vafast')
	})

	it('inherits header plain response not using the html plugin', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => {
					const response = new Response('Hello')
					response.headers.set('Server', 'Vafast')
					return response
				}
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Server')).toBe('Vafast')
		expect(res.headers.get('Content-Type')).toBe('text/plain;charset=utf-8')
	})

	it('inherits header json response when using the html plugin', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => {
					const response = new Response(JSON.stringify({ Hello: 1 }), {
						headers: { 'Content-Type': 'application/json' }
					})
					response.headers.set('Server', 'Vafast')
					return response
				}
			}
		])
		app.use(html())
		
		const res = await app.fetch(req('/'))
		expect(res.headers.get('Server')).toBe('Vafast')
	})

	it('inherits header json response not using the html plugin', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () => {
					const response = new Response(JSON.stringify({ Hello: 1 }), {
						headers: { 'Content-Type': 'application/json' }
					})
					response.headers.set('Server', 'Vafast')
					return response
				}
			}
		])

		const res = await app.fetch(req('/'))
		expect(res.headers.get('Server')).toBe('Vafast')
		expect(res.headers.get('Content-Type')).toBe('application/json')
	})
})
