import { createYoga } from 'graphql-yoga'
import { schema } from './schema'
import { createContext } from './context'
import { corsHeaders } from './utils/cors'
import { ExecutionContext } from 'graphql/execution/execute'

const yoga = createYoga({
  schema,
  context: createContext,
  cors: false, // 禁用 GraphQL Yoga 的内置 CORS 处理
  graphqlEndpoint: '/graphql',
  landingPage: false,
})

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    try {
      // 传递 Cloudflare 环境变量到 context
      const response = await yoga.fetch(request, {
        env,
        ctx,
        request,
      })

      // 创建新的响应头，避免重复的 CORS 头
      const responseHeaders = new Headers(response.headers)
      
      // 移除可能存在的重复 CORS 头
      responseHeaders.delete('Access-Control-Allow-Origin')
      responseHeaders.delete('Access-Control-Allow-Methods')
      responseHeaders.delete('Access-Control-Allow-Headers')
      responseHeaders.delete('Access-Control-Allow-Credentials')
      responseHeaders.delete('Access-Control-Max-Age')
      
      // 添加我们的 CORS 头
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value)
      })

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      })
    } catch (error) {
      console.error('GraphQL Error:', error)
      return new Response(
        JSON.stringify({
          errors: [{ message: 'Internal server error' }],
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }
  },
}

export interface Env {
  CHAT_DB1: any
  RATE_LIMIT1: any
  AI_API_URL: string
  AI_API_KEY: string
  AI_MODEL: string
  MAX_MESSAGES_PER_HOUR: string
  MAX_MESSAGE_LENGTH: string
}
