import React from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { EmptyState } from './EmptyState'
import { Message } from '../types'

interface MessageListProps {
  messages: Message[]
  loading: boolean
  onRegenerateResponse: (messageId: string) => void
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  onRegenerateResponse
}) => {
  if (messages.length === 0 && !loading) {
    return <EmptyState />
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLast={index === messages.length - 1}
          onRegenerateResponse={onRegenerateResponse}
        />
      ))}
      
      {loading && <TypingIndicator />}
    </div>
  )
}
