import { Server } from 'vafast'
import { html } from '../src'

// Simple HTML string function
function createPage(name: string): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Hello ${name}!</title>
				<style>
					body { 
						font-family: Arial, sans-serif; 
						margin: 40px; 
						background-color: #f0f0f0;
					}
					h1 { color: #333; }
					.container { 
						background: white; 
						padding: 20px; 
						border-radius: 8px; 
						box-shadow: 0 2px 4px rgba(0,0,0,0.1);
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>Hello ${name}!</h1>
					<p>Welcome to Vafast HTML Plugin!</p>
					<p>This is a simple HTML response.</p>
				</div>
			</body>
		</html>
	`
}

// Create server with routes
const app = new Server([
	{
		method: 'GET',
		path: '/',
		handler: () => createPage('World')
	},
	{
		method: 'GET',
		path: '/hello/:name',
		handler: (req) => {
			const name = (req as any).params?.name || 'World'
			return createPage(name)
		}
	},
	{
		method: 'GET',
		path: '/custom',
		handler: (req) => {
			return (req as any).html.html(`
				<!DOCTYPE html>
				<html>
					<head>
						<title>Custom Page</title>
					</head>
					<body>
						<h1>Custom HTML Response</h1>
						<p>This uses the html.html() method directly.</p>
						<p>Time: ${new Date().toISOString()}</p>
					</body>
				</html>
			`)
		}
	}
])

// Use HTML plugin
app.use(html())

// Export for Bun server
export default {
	fetch: (req: Request) => app.fetch(req)
}
