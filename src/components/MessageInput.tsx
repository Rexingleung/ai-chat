import React, { useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  loading: boolean
  onSendMessage: (content: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  loading,
  onSendMessage
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // 最大高度
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !loading) {
        onSendMessage(value.trim())
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !loading) {
      onSendMessage(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (Shift + Enter 换行)"
          className="w-full px-4 py-3 pr-12 border-0 rounded-2xl resize-none focus:ring-0 focus:outline-none max-h-[120px] scrollbar-thin"
          style={{ minHeight: '20px' }}
          disabled={loading}
          rows={1}
        />
        
        <button
          type="submit"
          disabled={!value.trim() || loading}
          className={clsx(
            'absolute right-2 bottom-2 p-2 rounded-xl transition-all',
            value.trim() && !loading
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
          title="发送消息"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="flex justify-between items-center px-2 mt-2">
        <div className="text-xs text-gray-500">
          按 Enter 发送，Shift + Enter 换行
        </div>
        <div className="text-xs text-gray-400">
          {value.length}/2000
        </div>
      </div>
    </form>
  )
}
