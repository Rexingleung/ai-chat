import React, { useState } from 'react'
import { format } from 'date-fns'
import { Copy, RefreshCw, User, Bot, Check, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import { Message } from '../types'

interface MessageBubbleProps {
  message: Message
  isLast: boolean
  onRegenerateResponse: (messageId: string) => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLast,
  onRegenerateResponse
}) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleRegenerate = () => {
    onRegenerateResponse(message.id)
  }

  return (
    <div className={clsx(
      'message-enter flex gap-3 max-w-full',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={clsx(
        'flex flex-col max-w-[80%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={clsx(
          'rounded-2xl px-4 py-3 relative group',
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            : message.error
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
        )}>
          {message.error && (
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">发送失败</span>
            </div>
          )}
          
          <div className={clsx(
            'whitespace-pre-wrap break-words',
            message.regenerating && 'opacity-50'
          )}>
            {message.content}
          </div>
          
          {message.regenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className={clsx(
            'absolute -bottom-8 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser ? 'right-0' : 'left-0'
          )}>
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="复制消息"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
            
            {isAssistant && isLast && (
              <button
                onClick={handleRegenerate}
                disabled={message.regenerating}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                title="重新生成回答"
              >
                <RefreshCw className={clsx(
                  'w-3 h-3',
                  message.regenerating && 'animate-spin'
                )} />
              </button>
            )}
          </div>
        </div>
        
        <div className={clsx(
          'text-xs text-gray-500 mt-1 px-1',
          isUser ? 'text-right' : 'text-left'
        )}>
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}
