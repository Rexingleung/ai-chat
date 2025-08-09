/**
 * 生成唯一ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 获取当前时间戳（秒）
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * 获取小时的开始时间戳
 */
export function getHourStartTimestamp(timestamp?: number): number {
  const date = new Date((timestamp || Date.now()))
  date.setMinutes(0, 0, 0)
  return Math.floor(date.getTime() / 1000)
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * 验证是否为有效的UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}
