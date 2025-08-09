import { useState, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { SEND_MESSAGE } from '../graphql/queries'
import { SendMessageMutation, SendMessageVariables } from '../graphql/types'
import { Message } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const useChatHistory = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId] = useState(() => uuidv4())
  
  const [sendMessageMutation, { loading }] = useMutation<SendMessageMutation, SendMessageVariables>(
    SEND_MESSAGE,
    {
      onError: (error) => {
        console.error('GraphQL Error:', error)
      }
    }
  )

  const sendMessage = useCallback(async (userMessage: Message) => {
    // 添加用户消息
    setMessages(prev => [...prev, userMessage])
    
    try {
      const { data } = await sendMessageMutation({
        variables: {
          content: userMessage.content,
          sessionId
        }
      })
      
      if (data?.sendMessage) {
        const assistantMessage: Message = {
          id: data.sendMessage.id,
          content: data.sendMessage.content,
          role: 'assistant',
          timestamp: new Date(data.sendMessage.timestamp)
        }
        
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Send message error:', error)
      
      // 添加错误消息
      const errorMessage: Message = {
        id: uuidv4(),
        content: '抱歉，发送消息时出现错误。请稍后重试。',
        role: 'assistant',
        timestamp: new Date(),
        error: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }, [sendMessageMutation, sessionId])

  const clearHistory = useCallback(() => {
    setMessages([])
  }, [])

  const regenerateResponse = useCallback(async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') return
    
    // 找到上一个用户消息
    const userMessageIndex = messageIndex - 1
    if (userMessageIndex < 0 || messages[userMessageIndex].role !== 'user') return
    
    const userMessage = messages[userMessageIndex]
    
    // 标记为重新生成中
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, regenerating: true } : msg
    ))
    
    try {
      const { data } = await sendMessageMutation({
        variables: {
          content: userMessage.content,
          sessionId
        }
      })
      
      if (data?.sendMessage) {
        const newAssistantMessage: Message = {
          id: data.sendMessage.id,
          content: data.sendMessage.content,
          role: 'assistant',
          timestamp: new Date(data.sendMessage.timestamp)
        }
        
        // 更曰消息
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? newAssistantMessage : msg
        ))
      }
    } catch (error) {
      console.error('Regenerate message error:', error)
      
      // 移除重新生成状态，添加错误标记
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, regenerating: false, error: true, content: '重新生成失败，请稍后重试。' } : msg
      ))
    }
  }, [messages, sendMessageMutation, sessionId])

  return {
    messages,
    loading,
    sendMessage,
    clearHistory,
    regenerateResponse,
    sessionId
  }
}
