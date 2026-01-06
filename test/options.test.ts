import { describe, expect, it } from 'vitest'
import { Server } from 'vafast'
import { html } from '../src'

function request(path: string) {
	return new Request(`http://localhost${path}`)
}

describe('options', () => {
	it('tests default contentType', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () =>
					new Response('<div></div>', {
						headers: { 'Content-Type': 'text/html' }
					})
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))

		expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf8')
	})

	it('tests custom contentType', async () => {
		const ct = 'NOT TEXT HTML'

		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () =>
					new Response('<div></div>', {
						headers: { 'Content-Type': 'text/html' }
					})
			}
		])
		app.use(html({ contentType: ct }))

		const res = await app.fetch(request('/'))

		expect(res.headers.get('Content-Type')).toBe(ct)
	})

	it('tests default autoDetect', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () =>
					new Response('<div></div>', {
						headers: { 'Content-Type': 'text/html' }
					})
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))

		expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf8')
	})

	it('tests false autoDetect', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: () =>
					new Response('<div></div>', {
						headers: { 'Content-Type': 'text/plain' }
					})
			},
			{
				method: 'GET',
				path: '/html',
				handler: (req) => (req as any).html.html('<div></div>')
			}
		])
		app.use(html({ autoDetect: false }))

		const res = await app.fetch(request('/'))
		expect(res.headers.get('Content-Type')).toBe('text/plain')

		const htmlRes = await app.fetch(request('/html'))
		expect(htmlRes.headers.get('Content-Type')).toBe(
			'text/html; charset=utf8'
		)
	})

	it('tests default autoDoctype', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => (req as any).html.html('<html></html>')
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))

		expect(await res.text()).toBe('<!doctype html><html></html>')
	})

	it('tests false autoDoctype', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => (req as any).html.html('<html></html>')
			}
		])
		app.use(html({ autoDoctype: false }))

		const res = await app.fetch(request('/'))

		expect(await res.text()).toBe('<html></html>')
	})

	it('tests true autoDoctype with non html tag', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) =>
					(req as any).html.html('<not-html></not-html>')
			}
		])
		app.use(html({ autoDoctype: true }))

		const res = await app.fetch(request('/'))

		expect(await res.text()).toBe('<not-html></not-html>')
	})

	it('tests full autoDoctype', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/invalid',
				handler: () =>
					new Response('<not-html></not-html>', {
						headers: { 'Content-Type': 'text/plain' }
					})
			},
			{
				method: 'GET',
				path: '/valid',
				handler: () =>
					new Response('<html></html>', {
						headers: { 'Content-Type': 'text/html' }
					})
			}
		])
		app.use(html({ autoDoctype: 'full' }))

		const invalid = await app.fetch(request('/invalid'))
		expect(await invalid.text()).toBe('<not-html></not-html>')

		const valid = await app.fetch(request('/valid'))
		// 当前实现只覆盖 Content-Type 头部，不处理 doctype
		expect(await valid.text()).toBe('<html></html>')
		expect(valid.headers.get('Content-Type')).toBe('text/html; charset=utf8')
	})
})
