import { describe, expect, it } from 'bun:test'
import { Server } from 'vafast'
import { html } from '../src'
import { Suspense, renderToStream, SuspenseScript } from '@kitajs/html/suspense'

function request(path: string) {
	return new Request(`http://localhost${path}`)
}

function handler() {
	return renderToStream(() => htmlContent)
}

const htmlContent = (
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

const htmlContentString = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

describe('Jsx html', () => {
	// FIX ME
	// it('auto return html', async () => {
	// 	const app = new Server([
	// 		{
	// 			method: 'GET',
	// 			path: '/',
	// 			handler
	// 		}
	// 	])
	// 	app.use(html())
	// 	const res = await app.fetch(request('/'))

	// 	expect(await res.text()).toBe(htmlContentString)
	// 	expect(res.headers.get('Content-Type')).toContain('text/html')
	// })

	it('auto return html with built in handler', async () => {
		const app = new Server([
			{
				method: 'GET',
				path: '/',
				handler: (req) => (req as any).html.html(htmlContent)
			}
		])
		app.use(html())

		const res = await app.fetch(request('/'))

		expect(await res.text()).toContain('Hello World')
		expect(res.headers.get('Content-Type')).toContain('text/html')
	})

	// it('works with async suspense', async () => {
	// 	const app = new Server([
	// 		{
	// 			method: 'GET',
	// 			path: '/',
	// 			handler: (req) => (req as any).html.html((rid) => (
	// 				<div>
	// 					<Suspense rid={rid} fallback={<div>1</div>}>
	// 						{Promise.resolve(<div>2</div>)}
	// 					</Suspense>
	// 				</div>
	// 			))
	// 		}
	// 	])
	// 	app.use(html())

	// 	const res = await app.fetch(request('/'))

	// 	expect(res.headers.get('Content-Type')).toContain('text/html')
	// 	expect(await res.text()).toBe(
	// 		<>
	// 			<div>
	// 				<div id="B:1" data-sf>
	// 					<div>1</div>
	// 				</div>
	// 			</div>
	// 			{SuspenseScript}
	// 			<template id="N:1" data-sr>
	// 				<div>2</div>
	// 			</template>
	// 			<script id="S:1" data-ss>
	// 				$RC(1)
	// 			</script>
	// 		</>
	// 	)
	// })
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
