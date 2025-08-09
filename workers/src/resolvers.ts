import { Context } from './context'
import { generateId } from './utils/helpers'
import { checkRateLimit, updateRateLimit } from './utils/rateLimit'
import { callAI } from './utils/ai'
import { validateMessage } from './utils/validation'

export const resolvers = {
  Query: {
    chatHistory: async (
      parent: any,
      args: { sessionId: string },
      context: Context
    ) => {
      try {
        const { sessionId } = args
        const sessionData = await context.env.CHAT_DB.get(`session:${sessionId}`)
        
        if (!sessionData) {
          return null
        }
        
        return JSON.parse(sessionData)
      } catch (error) {
        console.error('Get chat history error:', error)
        throw new Error('Failed to retrieve chat history')
      }
    },

    rateLimit: async (parent: any, args: any, context: Context) => {
      try {
        const clientIP = context.request.headers.get('CF-Connecting-IP') || 'unknown'
        const rateLimit = await checkRateLimit(context.env.RATE_LIMIT, clientIP)
        
        return {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime,
        }
      } catch (error) {
        console.error('Get rate limit error:', error)
        return {
          remaining: 0,
          resetTime: Date.now() + 3600000, // 1 hour from now
        }
      }
    },

    health: () => 'OK',
  },

  Mutation: {
    sendMessage: async (
      parent: any,
      args: { content: string; sessionId?: string },
      context: Context
    ) => {
      try {
        const { content, sessionId } = args
        const clientIP = context.request.headers.get('CF-Connecting-IP') || 'unknown'
        
        // 验证消息
        const validation = validateMessage(content, context.env.MAX_MESSAGE_LENGTH)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
        
        // 检查速率限制
        const rateLimit = await checkRateLimit(context.env.RATE_LIMIT, clientIP)
        if (rateLimit.remaining <= 0) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        
        // 更新速率限制
        await updateRateLimit(context.env.RATE_LIMIT, clientIP)
        
        const currentSessionId = sessionId || generateId()
        const messageId = generateId()
        const timestamp = new Date().toISOString()
        
        // 获取现有会话或创建新会话
        let session
        const existingSession = await context.env.CHAT_DB.get(`session:${currentSessionId}`)
        
        if (existingSession) {
          session = JSON.parse(existingSession)
        } else {
          session = {
            id: currentSessionId,
            title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
            messages: [],
            createdAt: timestamp,
            updatedAt: timestamp,
          }
        }
        
        // 添加用户消息
        const userMessage = {
          id: generateId(),
          content,
          role: 'user',
          timestamp,
        }
        
        session.messages.push(userMessage)
        
        // 获取AI回复
        const aiResponse = await callAI({
          messages: session.messages.slice(-10), // 只发送最近10条消息
          apiUrl: context.env.AI_API_URL,
          apiKey: context.env.AI_API_KEY,
        })
        
        // 添加AI回复
        const assistantMessage = {
          id: messageId,
          content: aiResponse,
          role: 'assistant',
          timestamp: new Date().toISOString(),
        }
        
        session.messages.push(assistantMessage)
        session.updatedAt = assistantMessage.timestamp
        
        // 保存会话
        await context.env.CHAT_DB.put(
          `session:${currentSessionId}`,
          JSON.stringify(session),
          { expirationTtl: 7 * 24 * 60 * 60 } // 7天过期
        )
        
        return {
          ...assistantMessage,
          sessionId: currentSessionId,
        }
      } catch (error) {
        console.error('Send message error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to send message')
      }
    },

    createSession: async (
      parent: any,
      args: { title?: string },
      context: Context
    ) => {
      try {
        const sessionId = generateId()
        const timestamp = new Date().toISOString()
        
        const session = {
          id: sessionId,
          title: args.title || '新对话',
          messages: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        
        await context.env.CHAT_DB.put(
          `session:${sessionId}`,
          JSON.stringify(session),
          { expirationTtl: 7 * 24 * 60 * 60 }
        )
        
        return {
          id: sessionId,
          title: session.title,
          createdAt: timestamp,
        }
      } catch (error) {
        console.error('Create session error:', error)
        throw new Error('Failed to create session')
      }
    },
  },
}
