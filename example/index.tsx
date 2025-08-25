/** @jsx createElement */
import { Server } from 'vafast'
import { html } from '../src'
import { Suspense } from '@kitajs/html/suspense'
import { createElement } from '@kitajs/html'

// JSX namespace declaration for @kitajs/html


function page({ name }: { name: string }): string {
	return `
		<html lang="en" style="background-color: black; color: white;">
			<head>
				<title>Hello ${name}!</title>
			</head>
			<body>
				<h1>Hello ${name}!</h1>
			</body>
		</html>
	`
}

// JSX example
function TsxPage({ name }: { name: string }): JSX.Element {
	return (
		<html lang="en" style={{ backgroundColor: 'black', color: 'white' }}>
			<head>
				<title safe>Hello {name}!</title>
			</head>
			<body>
				<h1 safe>Hello {name}!</h1>
			</body>
		</html>
	)
}

async function FakeDatabase({ name }: { name: string }) {
	// Sleeps 1 second
	await new Promise((resolve) => setTimeout(resolve, 1000))
	return <h1 safe>Hello {name}!</h1>
}

function AsyncPage({ name, id }: { id: number; name: string }): JSX.Element {
	return (
		<html lang="en" style={{ backgroundColor: 'black', color: 'white' }}>
			<head>
				<title safe>Hello {name}!</title>
			</head>
			<body>
				{/* https://github.com/kitajs/html#suspense-component */}
				<Suspense rid={id} fallback={<h1>Loading...</h1>}>
					<FakeDatabase name={name} />
				</Suspense>
			</body>
		</html>
	)
}

// Create server with routes
const app = new Server([
	{
		method: 'GET',
		path: '/',
		handler: () => <h1>Hello World</h1>
	},
	{
		method: 'GET',
		path: '/page/:name',
		handler: (req) => {
			const name = (req as any).params?.name || 'World'
			return (req as any).html.html(page({ name }))
		}
	},
	{
		method: 'GET',
		path: '/tsx/:name',
		handler: (req) => {
			const name = (req as any).params?.name || 'World'
			return (req as any).html.html(<TsxPage name={name} />)
		}
	},
	{
		method: 'GET',
		path: '/async/:name',
		handler: (req) => {
			const name = (req as any).params?.name || 'World'
			return (req as any).html.stream(AsyncPage, { name })
		}
	}
])

// Use HTML plugin
app.use(html())

// Start server using Bun.serve
Bun.serve({
	port: 8080,
	fetch: (req: Request) => app.fetch(req)
})

console.log('Server running at http://localhost:8080')
console.log('Try these endpoints:')
console.log('  - http://localhost:8080/')
console.log('  - http://localhost:8080/page/YourName')
console.log('  - http://localhost:8080/tsx/YourName')
console.log('  - http://localhost:8080/async/YourName')
