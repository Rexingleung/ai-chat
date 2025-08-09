import { createYoga } from 'graphql-yoga'
import { schema } from './schema'
import { createContext } from './context'
import { corsHeaders } from './utils/cors'

const yoga = createYoga({
  schema,
  context: createContext,
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
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

      // 添加 CORS 头
      const corsResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          ...corsHeaders,
        },
      })

      return corsResponse
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
  CHAT_DB: KVNamespace
  RATE_LIMIT: KVNamespace
  AI_API_URL: string
  AI_API_KEY: string
  AI_MODEL: string
  MAX_MESSAGES_PER_HOUR: string
  MAX_MESSAGE_LENGTH: string
}
