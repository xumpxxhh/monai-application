export const API_URL = 'http://localhost:3000';

export { AuthCode, AUTH_CODE_MESSAGES, getAuthMessage, type AuthCodeType } from './auth-codes';
export {
  AUTH_API_BASE_URL,
  validateAuth,
  requestLogin,
  logout,
  exchangeTokenByCode,
  getUserInfo,
  refreshToken,
  fetchWithRefresh,
  type AuthUser,
  type ValidateAuthOptions,
  type RequestLoginOptions,
  type LogoutOptions,
  type TokenByCodeOptions,
  type RefreshTokenOptions,
  type IUserInfo,
} from './auth-client';
