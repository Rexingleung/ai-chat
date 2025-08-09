import React from 'react'
import { Bot } from 'lucide-react'

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 max-w-full justify-start message-enter">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      
      <div className="flex flex-col items-start">
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-500 ml-2">正在思考...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
