import React, { useState, useCallback } from 'react'
import { ChatContainer } from './components/ChatContainer'
import { Header } from './components/Header'
import { useChatHistory } from './hooks/useChatHistory'
import { Message } from './types'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const {
    messages,
    loading,
    sendMessage,
    clearHistory,
    regenerateResponse
  } = useChatHistory()
  
  const [input, setInput] = useState('')

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return
    
    const userMessage: Message = {
      id: uuidv4(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }
    
    setInput('')
    await sendMessage(userMessage)
  }, [sendMessage, loading])

  const handleInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }, [input, handleSendMessage])

  const handleRegenerateResponse = useCallback((messageId: string) => {
    regenerateResponse(messageId)
  }, [regenerateResponse])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Header 
        onClearHistory={clearHistory}
        messageCount={messages.length}
      />
      
      <main className="flex-1 flex flex-col">
        <ChatContainer
          messages={messages}
          loading={loading}
          input={input}
          onInputChange={setInput}
          onSubmit={handleInputSubmit}
          onSendMessage={handleSendMessage}
          onRegenerateResponse={handleRegenerateResponse}
        />
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-500 border-t bg-white/80">
        <p>
          基于 React + TypeScript + GraphQL + Cloudflare Workers 构建
        </p>
      </footer>
    </div>
  )
}

export default App
