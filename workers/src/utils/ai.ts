interface AIMessage {
  id: string
  content: string
  role: string
  timestamp: string
}

interface CallAIParams {
  messages: AIMessage[]
  apiUrl: string
  apiKey: string
}

/**
 * 调用AI API
 */
export async function callAI({ messages, apiUrl, apiKey }: CallAIParams): Promise<string> {
  try {
    // 转换消息格式为OpenAI格式
    const openAIMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    // 添加系统提示
    const systemMessage = {
      role: 'system',
      content: '你是一个友好、有用的AI助手。请用中文回答问题，并提供准确、有用的信息。保持回答简洁明了，但要包含必要的细节。'
    }

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...openAIMessages],
      temperature: 0.7,
      max_tokens: 1500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('AI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后重试。')
      } else if (response.status === 401) {
        throw new Error('API密钥错误，请检查配置。')
      } else {
        throw new Error('服务暂时不可用，请稍后重试。')
      }
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI response format:', data)
      throw new Error('获取AI回复失败，请稍后重试。')
    }

    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Call AI error:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('获取AI回复失败，请稍后重试。')
  }
}

/**
 * 检查AI API健康状态
 */
export async function checkAIHealth(apiUrl: string, apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('AI health check error:', error)
    return false
  }
}
