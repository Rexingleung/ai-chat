import React from 'react'
import { MessageCircle, Sparkles, Zap, Heart } from 'lucide-react'

const suggestions = [
  {
    icon: Sparkles,
    text: '"介绍一下人工智能的发展历史"',
    category: '知识问答'
  },
  {
    icon: Zap,
    text: '"帮我写一个Python函数来处理文本"',
    category: '编程助手'
  },
  {
    icon: Heart,
    text: '"给我一些健康生活的建议"',
    category: '生活指导'
  }
]

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl mb-6">
        <MessageCircle className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        欢迎使用 AI Chat
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        我是您的AI助手，可以帮您回答问题、进行创作、解决问题等。请随时提问！
      </p>
      
      <div className="grid gap-3 w-full max-w-2xl">
        <h3 className="text-sm font-medium text-gray-500 mb-2">您可以尝试问我：</h3>
        
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-lg flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                  {suggestion.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {suggestion.category}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-md">
        <p className="text-sm text-blue-800">
          <strong>提示：</strong> 您可以使用 Shift + Enter 来在输入框中换行，然后按 Enter 发送消息。
        </p>
      </div>
    </div>
  )
}
