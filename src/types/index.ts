export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  error?: boolean
  regenerating?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface SendMessageResponse {
  id: string
  content: string
  role: 'assistant'
  timestamp: string
}

export interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: {
      code?: string
    }
  }>
}

export interface RateLimitInfo {
  remaining: number
  resetTime: number
}
