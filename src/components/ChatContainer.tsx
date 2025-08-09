import React, { useEffect, useRef } from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Message } from '../types'

interface ChatContainerProps {
  messages: Message[]
  loading: boolean
  input: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onSendMessage: (content: string) => void
  onRegenerateResponse: (messageId: string) => void
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  loading,
  input,
  onInputChange,
  onSubmit,
  onSendMessage,
  onRegenerateResponse
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList 
          messages={messages}
          loading={loading}
          onRegenerateResponse={onRegenerateResponse}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="py-4">
        <MessageInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          loading={loading}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  )
}
