/**
 * 认证/请求相关错误码常量，避免硬编码
 */
export const AuthCode = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type AuthCodeType = (typeof AuthCode)[keyof typeof AuthCode];

/**
 * 错误码 -> 用户可见提示文案
 */
export const AUTH_CODE_MESSAGES: Record<AuthCodeType, string> = {
  [AuthCode.INVALID_REQUEST]: '请求参数无效',
  [AuthCode.INVALID_CREDENTIALS]: '邮箱或密码错误',
  [AuthCode.UNAUTHORIZED]: '未授权，请先登录',
  [AuthCode.INVALID_TOKEN]: '登录已过期，请重新登录',
  [AuthCode.EMAIL_EXISTS]: '该邮箱已被注册',
  [AuthCode.INVALID_EMAIL]: '邮箱格式不正确',
  [AuthCode.PASSWORD_TOO_SHORT]: '密码长度不足',
  [AuthCode.INTERNAL_ERROR]: '服务器错误，请稍后重试',
};

/**
 * 根据错误码获取提示文案，未知码返回默认文案
 */
export function getAuthMessage(code: string | undefined, defaultMessage = '发生错误'): string {
  if (!code) return defaultMessage;
  return AUTH_CODE_MESSAGES[code as AuthCodeType] ?? defaultMessage;
}
