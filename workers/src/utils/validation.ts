/**
 * 验证消息内容
 */
export function validateMessage(content: string, maxLength: string): {
  valid: boolean
  error?: string
} {
  if (!content || typeof content !== 'string') {
    return {
      valid: false,
      error: 'Message content is required and must be a string'
    }
  }
  
  const trimmedContent = content.trim()
  
  if (trimmedContent.length === 0) {
    return {
      valid: false,
      error: 'Message content cannot be empty'
    }
  }
  
  const maxLen = parseInt(maxLength) || 2000
  if (trimmedContent.length > maxLen) {
    return {
      valid: false,
      error: `Message content cannot exceed ${maxLen} characters`
    }
  }
  
  // 检查是否包含不合适的内容
  const forbiddenPatterns = [
    /\b(hack|attack|malware|virus)\b/i,
    /\b(password|private key|secret)\b/i,
  ]
  
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(trimmedContent)) {
      return {
        valid: false,
        error: 'Message content contains inappropriate terms'
      }
    }
  }
  
  return { valid: true }
}

/**
 * 验证会话标题
 */
export function validateSessionTitle(title: string): {
  valid: boolean
  error?: string
} {
  if (title && typeof title !== 'string') {
    return {
      valid: false,
      error: 'Session title must be a string'
    }
  }
  
  if (title && title.length > 100) {
    return {
      valid: false,
      error: 'Session title cannot exceed 100 characters'
    }
  }
  
  return { valid: true }
}
