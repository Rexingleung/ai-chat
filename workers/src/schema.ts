import { buildSchema } from 'graphql'
import { resolvers } from './resolvers'

const typeDefs = `
  type Query {
    chatHistory(sessionId: String!): ChatSession
    rateLimit: RateLimitInfo
    health: String
  }

  type Mutation {
    sendMessage(content: String!, sessionId: String): MessageResponse!
    createSession(title: String): SessionResponse!
  }

  type Message {
    id: String!
    content: String!
    role: String!
    timestamp: String!
  }

  type ChatSession {
    id: String!
    title: String
    messages: [Message!]!
    createdAt: String!
    updatedAt: String!
  }

  type MessageResponse {
    id: String!
    content: String!
    role: String!
    timestamp: String!
    sessionId: String!
  }

  type SessionResponse {
    id: String!
    title: String!
    createdAt: String!
  }

  type RateLimitInfo {
    remaining: Int!
    resetTime: Int!
  }
`

export const schema = buildSchema(typeDefs)

// 绑定解析器
Object.keys(resolvers.Query || {}).forEach(key => {
  schema.getQueryType()!.getFields()[key].resolve = resolvers.Query[key]
})

Object.keys(resolvers.Mutation || {}).forEach(key => {
  schema.getMutationType()!.getFields()[key].resolve = resolvers.Mutation[key]
})
