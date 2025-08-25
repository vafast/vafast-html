import type { Middleware } from 'vafast'
import { Readable } from 'node:stream'
import { renderToStream } from '@kitajs/html/suspense'

import { handleHtml } from './handler'
import { HtmlOptions } from './options'
import { isHtml } from './utils'

export function createHtmlPlugin(options: HtmlOptions = {}): Middleware {
	// Defaults
	options.contentType ??= 'text/html; charset=utf8'
	options.autoDetect ??= true
	options.isHtml ??= isHtml
	options.autoDoctype ??= true

	return async (req, next) => {
		// 创建 HTML 响应对象
		const htmlResponse = {
			html(
				value: Readable | JSX.Element
			): Promise<Response | string> | Response | string {
				return handleHtml(value, options, false)
			},
			stream<A = any>(
				value: (this: void, arg: A & { id: number }) => JSX.Element,
				args: A
			) {
				return handleHtml(
					renderToStream((id) =>
						(value as Function)({ ...args, id })
					),
					options,
					false
				)
			}
		}

		// 将 HTML 响应对象注入到请求中
		;(req as any).html = htmlResponse

		// 继续执行下一个中间件或处理器
		const response = await next()

		// 自动检测 HTML 响应
		if (options.autoDetect) {
			// 检查响应是否已经是 HTML 类型
			const contentType = response.headers.get('content-type') || response.headers.get('Content-Type')
			if (contentType && contentType.includes('text/html')) {
				// 创建一个新的 Response，使用插件配置的 contentType
				const newResponse = new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: new Headers(response.headers)
				})
				newResponse.headers.set('content-type', options.contentType!)
				return newResponse
			}
			
			// 检查响应内容是否为 HTML
			if (isHtml(response)) {
				// 创建一个新的 Response，使用插件配置的 contentType
				const newResponse = new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: new Headers(response.headers)
				})
				newResponse.headers.set('content-type', options.contentType!)
				return newResponse
			}
		}

		return response
	}
}

// 导出默认插件
export const html = createHtmlPlugin
