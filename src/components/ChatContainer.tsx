import React, { useEffect, useRef } from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Message } from '../types'

interface ChatContainerProps {
  messages: Message[]
  loading: boolean
  input: string
  onInputChange: (value: string) => void
  onSendMessage: (content: string) => void
  onRegenerateResponse: (messageId: string) => void
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  loading,
  input,
  onInputChange,
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
    <div className="flex flex-col flex-1 px-4 mx-auto w-full max-w-4xl">
      <div className="flex overflow-hidden flex-col flex-1">
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
          loading={loading}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  )
}
