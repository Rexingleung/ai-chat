export interface SendMessageMutation {
  sendMessage: {
    id: string
    content: string
    role: string
    timestamp: string
    sessionId: string
  }
}

export interface SendMessageVariables {
  content: string
  sessionId?: string
}

export interface ChatHistoryQuery {
  chatHistory: {
    id: string
    messages: Array<{
      id: string
      content: string
      role: string
      timestamp: string
    }>
    createdAt: string
    updatedAt: string
  }
}

export interface ChatHistoryVariables {
  sessionId: string
}

export interface CreateSessionMutation {
  createSession: {
    id: string
    title: string
    createdAt: string
  }
}

export interface CreateSessionVariables {
  title?: string
}

export interface RateLimitQuery {
  rateLimit: {
    remaining: number
    resetTime: number
  }
}
