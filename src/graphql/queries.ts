import { gql } from '@apollo/client'

export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $sessionId: String) {
    sendMessage(content: $content, sessionId: $sessionId) {
      id
      content
      role
      timestamp
      sessionId
    }
  }
`

export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($sessionId: String!) {
    chatHistory(sessionId: $sessionId) {
      id
      messages {
        id
        content
        role
        timestamp
      }
      createdAt
      updatedAt
    }
  }
`

export const CREATE_SESSION = gql`
  mutation CreateSession($title: String) {
    createSession(title: $title) {
      id
      title
      createdAt
    }
  }
`

export const GET_RATE_LIMIT = gql`
  query GetRateLimit {
    rateLimit {
      remaining
      resetTime
    }
  }
`
