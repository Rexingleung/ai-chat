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
  model: string
}

/**
 * 调用AI API (支持DeepSeek和OpenAI)
 */
export async function callAI({ messages, apiUrl, apiKey, model }: CallAIParams): Promise<string> {
  try {
    // 转换消息格式为OpenAI兼容格式
    const openAIMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    // 添加系统提示（针对DeepSeek优化）
    const systemMessage = {
      role: 'system',
      content: '你是一个友好、有用的AI助手。请用中文回答问题，并提供准确、有用的信息。保持回答简洁明了，但要包含必要的细节。你具有广泛的知识，可以帮助用户解决各种问题。'
    }

    // 根据模型调整参数
    const isDeepSeek = model.includes('deepseek')
    const requestBody: any = {
      model: model,
      messages: [systemMessage, ...openAIMessages],
      temperature: isDeepSeek ? 0.7 : 0.7,
      max_tokens: isDeepSeek ? 2000 : 1500,
      stream: false,
    }

    // DeepSeek特定参数
    if (isDeepSeek) {
      requestBody.frequency_penalty = 0.1
      requestBody.presence_penalty = 0.1
      requestBody.top_p = 0.95
    } else {
      // OpenAI参数
      requestBody.presence_penalty = 0.1
      requestBody.frequency_penalty = 0.1
    }

    console.log('Calling AI API:', {
      url: apiUrl,
      model: model,
      messageCount: openAIMessages.length
    })

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
      } else if (response.status === 400) {
        throw new Error('请求参数错误，请检查输入内容。')
      } else if (response.status >= 500) {
        throw new Error('AI服务暂时不可用，请稍后重试。')
      } else {
        throw new Error(`请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`)
      }
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI response format:', data)
      throw new Error('获取AI回复失败，响应格式错误。')
    }

    const content = data.choices[0].message.content
    if (!content || typeof content !== 'string') {
      throw new Error('AI回复内容为空或格式错误。')
    }

    console.log('AI response received:', {
      model: data.model || model,
      usage: data.usage,
      contentLength: content.length
    })

    return content.trim()
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
export async function checkAIHealth(apiUrl: string, apiKey: string, model: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
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

/**
 * 获取支持的AI模型列表
 */
export function getSupportedModels(): string[] {
  return [
    'deepseek-chat',
    'deepseek-coder',
    'gpt-3.5-turbo',
    'gpt-4',
    'gpt-4-turbo-preview'
  ]
}

/**
 * 验证模型名称
 */
export function validateModel(model: string): boolean {
  const supportedModels = getSupportedModels()
  return supportedModels.includes(model)
}
