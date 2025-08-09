import { getCurrentTimestamp, getHourStartTimestamp } from './helpers'

interface RateLimitData {
  count: number
  resetTime: number
}

/**
 * 检查速率限制
 */
export async function checkRateLimit(
  rateLimitKV: KVNamespace,
  clientIP: string,
  maxRequests: number = 60
): Promise<{ remaining: number; resetTime: number }> {
  const currentTime = getCurrentTimestamp()
  const hourStart = getHourStartTimestamp(currentTime * 1000)
  const key = `rate_limit:${clientIP}:${hourStart}`
  
  try {
    const existing = await rateLimitKV.get(key)
    let rateLimitData: RateLimitData
    
    if (existing) {
      rateLimitData = JSON.parse(existing)
    } else {
      rateLimitData = {
        count: 0,
        resetTime: hourStart + 3600 // 1小时后
      }
    }
    
    const remaining = Math.max(0, maxRequests - rateLimitData.count)
    
    return {
      remaining,
      resetTime: rateLimitData.resetTime * 1000 // 转换为毫秒
    }
  } catch (error) {
    console.error('Check rate limit error:', error)
    // 出错时假设没有限制
    return {
      remaining: maxRequests,
      resetTime: (hourStart + 3600) * 1000
    }
  }
}

/**
 * 更新速率限制
 */
export async function updateRateLimit(
  rateLimitKV: KVNamespace,
  clientIP: string
): Promise<void> {
  const currentTime = getCurrentTimestamp()
  const hourStart = getHourStartTimestamp(currentTime * 1000)
  const key = `rate_limit:${clientIP}:${hourStart}`
  
  try {
    const existing = await rateLimitKV.get(key)
    let rateLimitData: RateLimitData
    
    if (existing) {
      rateLimitData = JSON.parse(existing)
      rateLimitData.count += 1
    } else {
      rateLimitData = {
        count: 1,
        resetTime: hourStart + 3600
      }
    }
    
    // 设置1小时过期
    const ttl = rateLimitData.resetTime - currentTime
    
    await rateLimitKV.put(
      key,
      JSON.stringify(rateLimitData),
      { expirationTtl: Math.max(ttl, 60) } // 至少保存60秒
    )
  } catch (error) {
    console.error('Update rate limit error:', error)
    // 静默失败，不阻塞正常请求
  }
}

/**
 * 清理过期的速率限制数据
 */
export async function cleanupExpiredRateLimit(
  rateLimitKV: KVNamespace,
  clientIP: string
): Promise<void> {
  const currentTime = getCurrentTimestamp()
  
  try {
    // 获取所有相关的键
    const list = await rateLimitKV.list({ prefix: `rate_limit:${clientIP}:` })
    
    for (const item of list.keys) {
      const data = await rateLimitKV.get(item.name)
      if (data) {
        const rateLimitData: RateLimitData = JSON.parse(data)
        if (rateLimitData.resetTime < currentTime) {
          await rateLimitKV.delete(item.name)
        }
      }
    }
  } catch (error) {
    console.error('Cleanup rate limit error:', error)
  }
}
