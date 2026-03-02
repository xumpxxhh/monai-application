export const API_URL = 'http://localhost:3000';

export { AuthCode, AUTH_CODE_MESSAGES, getAuthMessage, type AuthCodeType } from './auth-codes';
export {
  AUTH_API_BASE_URL,
  validateAuth,
  requestLogin,
  logout,
  exchangeTokenByCode,
  getUserInfo,
  type AuthUser,
  type ValidateAuthOptions,
  type RequestLoginOptions,
  type LogoutOptions,
  type TokenByCodeOptions,
} from './auth-client';
